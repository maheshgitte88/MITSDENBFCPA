const express = require('express');
const upload = require('../multerConfig');
const router = express.Router();
const ExcelJS = require('exceljs');
const Fibe = require('../Models/Fibe');
const IciciBankStatment = require('../Models/IciciBankStatment');
const LoanFeeOnlyTranstions = require('../Models/LoanFeeOnlyTranstions');
const moment = require('moment/moment');



function formatDate(dateString) {
    // Use moment to format the date string to 'MM/DD/YYYY'
    return dateString ? moment(dateString).format('MM/DD/YYYY') : null;
}

router.post('/Fibe-statement', upload.single('excelFile'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);

        const worksheet = workbook.getWorksheet(1);
        if (worksheet) {
            const dataToSave = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber !== 1) {
                    const rowData = {
                        // createDate: formatDate(row.getCell(1).value) || null,
                        createDate: row.getCell(1).value || null,
                        orderId: String(row.getCell(2).value) || null,
                        mobileNumber: String(row.getCell(3).value) || null,
                        customerName: String(row.getCell(4).value) || null,
                        chanceOfApproval: String(row.getCell(5).value) || null,
                        tentativeLimit: parseFloat(row.getCell(6).value) || null,
                        orderAmount: parseFloat(row.getCell(7).value.replace(/,/g, '')) || null,
                        detailedStatus: String(row.getCell(8).value) || null,
                        availableLimit: parseFloat(row.getCell(9).value) || null,
                        customerId: String(row.getCell(10).value) || null,
                        suspReason: String(row.getCell(11).value) || null,
                        rejReason: String(row.getCell(12).value) || null,
                        agent: String(row.getCell(13).value) || null,
                        agentMob: String(row.getCell(14).value) || null,
                        city: String(row.getCell(15).value) || null,
                        state: String(row.getCell(16).value) || null,
                        age: parseInt(row.getCell(17).value) || null,
                        FLDG: String(row.getCell(18).value) || null,
                        surrogateApproval: String(row.getCell(19).value) || null,
                        source: String(row.getCell(20).value) || null,
                        channel: String(row.getCell(21).value) || null,
                        emailId: String(row.getCell(22).value) || null,
                        queue: String(row.getCell(23).value) || null,
                        behalf: String(row.getCell(24).value) || null,
                        disbursedAmount: parseFloat(row.getCell(25).value.replace(/,/g, '')) || null,
                        sanctionAmount: parseFloat(row.getCell(26).value.replace(/,/g, '')) || null,
                        disbursementDate: row.getCell(27).value || null,
                        emi: parseFloat(row.getCell(28).value) || null,
                        firstEmiDate: row.getCell(29).value || null,
                        UTR: String(row.getCell(30).value) || null,
                        studentMobile: String(row.getCell(31).value) || null,
                        numberOfEmis: parseInt(row.getCell(32).value) || null,
                        refundStatus: String(row.getCell(33).value) || null,
                        subvention: String(row.getCell(34).value) || null,
                        merchant: String(row.getCell(35).value) || null,
                        loanId: String(row.getCell(36).value) || null,
                        loanStatus: String(row.getCell(37).value) || null,
                        merchantType: String(row.getCell(38).value) || null,
                        settlementStatus: String(row.getCell(39).value) || null,
                        transactionType: String(row.getCell(40).value) || null,
                        readyForDisburse: String(row.getCell(41).value) || null,
                        downpaymentAmount: parseFloat(row.getCell(42).value) || null,
                        FLDGReason: String(row.getCell(43).value) || null,
                        applicantEmail: String(row.getCell(44).value) || null,
                        applicantName: String(row.getCell(45).value) || null,
                        applicationType: String(row.getCell(46).value) || null,
                        downpaymentRefundTime: row.getCell(47).value || null,
                        downpaymentRefundStatus: String(row.getCell(48).value) || null,
                        settlementMerchantId: String(row.getCell(49).value) || null,
                        settlementMerchantName: String(row.getCell(50).value) || null,
                    }
                    dataToSave.push(rowData);
                }
            });

            await Promise.all(dataToSave.map(async (rowData) => {
                const existingRecord = await Fibe.findOne({ where: { UTR: rowData.UTR } });

                if (!existingRecord) {
                    await Fibe.create(rowData);
                    console.log(`Record with UTR ${rowData.UTR} created.`);
                } else {
                    console.log(`Record with UTR ${rowData.UTR} already exists. Skipping.`);
                }
            }));

            console.log('All data saved to the database.');
            res.json({ message: 'Excel data uploaded and saved to the database.' });
        } else {
            res.status(400).json({ error: 'No valid worksheet found in the Excel file.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function saveCombinedDataWithICICToDatabase(data) {
    try {
        for (const item of data) {
            if (item.matchingStatements.length > 0) {

                const [LoanFeeOnlyTranstionsInstance, created] = await LoanFeeOnlyTranstions.findOrCreate({
                    where: { Bank_tranId: item.matchingStatements[0].tranId },
                    defaults: {
                        date_of_Payment: formatDate(item.disbursementDate),
                        mode_of_payment: 'Loan',
                        MITSDE_Bank_Name: 'ICICI BANK LTD 098505011038',
                        instrument_No: item.UTR,
                        amount: item.matchingStatements[0].depositAmt || null,
                        clearance_Date: item.matchingStatements[0].transactionDate || null,
                        student_Name: item.customerName,
                        student_Mobile_No: item.mobileNumber,
                        student_Email_ID: item.emailId,
                        course_Name: 'MITSDE Course',
                        finance_charges: (item.orderAmount-item.disbursedAmount) -item.downpaymentAmount,
                        Bank_tranId: item.matchingStatements[0].tranId || null,
                        transactionRemarks: item.matchingStatements[0].transactionRemarks || null,
                    },
                });

                if (created) {
                    console.log('New CombinedData instance created:', LoanFeeOnlyTranstionsInstance.get());
                } else {
                    console.log('CombinedData instance already exists:', LoanFeeOnlyTranstionsInstance.get());
                }
            }
        }
        console.log('Data saved to the database.');
        return 'Data saved to the database.'; // Return success message

    } catch (error) {
        console.error('Error saving data to the database:', error);
        throw error;
    }
}


router.get('/Fibe-only-data', async (req, res) => {
    try {
        const result = await Fibe.findAll({
            attributes: [
                'disbursementDate',
                'orderAmount',
                'disbursedAmount',
                'downpaymentAmount',
                'emailId',
                'customerName',
                'mobileNumber',
                // 'courseName',
                // 'subventionFinanceCharges',
                'UTR'
            ]
        });

        const statementResult = await IciciBankStatment.findAll({
            attributes: [
                'tranId',
                'transactionDate',
                'depositAmt',
                'transactionRemarks',
            ]
        });

        const utrValues = result.map(item => item.UTR);

        const filteredStatementResult = statementResult.filter(item => {
            const splitRemarks = item.transactionRemarks.split('-');
            const utrPart = splitRemarks[1];
            return utrValues.includes(utrPart);
        });

        const filteredStatementResults = statementResult.filter(item => {
            const transactionRemarksMatch = item.transactionRemarks.match(/\/(\d+)\//);
            return transactionRemarksMatch && utrValues.includes(transactionRemarksMatch[1]);
        });


        const data = result.map(FibeItem => {
            const matchingStatements = filteredStatementResult.concat(filteredStatementResults)
                .filter(statementItem => statementItem.transactionRemarks.includes(FibeItem.UTR));
            return {
                ...FibeItem.dataValues,
                matchingStatements,
            };
        });

        const saveResult = await saveCombinedDataWithICICToDatabase(data);
        res.json({ data, saveResult });

    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






module.exports = router;
