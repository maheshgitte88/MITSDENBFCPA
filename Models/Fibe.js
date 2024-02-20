const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Fibe = sequelize.define('Fibe', {
    createDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chanceOfApproval: {
        type: DataTypes.STRING
    },
    tentativeLimit: {
        type: DataTypes.FLOAT
    },
    orderAmount: {
        type: DataTypes.FLOAT
    },
    detailedStatus: {
        type: DataTypes.STRING
    },
    availableLimit: {
        type: DataTypes.FLOAT
    },
    customerId: {
        type: DataTypes.STRING
    },
    suspReason: {
        type: DataTypes.STRING
    },
    rejReason: {
        type: DataTypes.STRING
    },
    agent: {
        type: DataTypes.STRING
    },
    agentMob: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.INTEGER
    },
    FLDG: {
        type: DataTypes.STRING
    },
    surrogateApproval: {
        type: DataTypes.STRING
    },
    source: {
        type: DataTypes.STRING
    },
    channel: {
        type: DataTypes.STRING
    },
    emailId: {
        type: DataTypes.STRING
    },
    queue: {
        type: DataTypes.STRING
    },
    behalf: {
        type: DataTypes.STRING
    },
    disbursedAmount: {
        type: DataTypes.FLOAT
    },
    sanctionAmount: {
        type: DataTypes.FLOAT
    },
    disbursementDate: {
        type: DataTypes.DATE
    },
    emi: {
        type: DataTypes.FLOAT
    },
    firstEmiDate: {
        type: DataTypes.DATE
    },
    UTR: {
        type: DataTypes.STRING
    },
    studentMobile: {
        type: DataTypes.STRING
    },
    numberOfEmis: {
        type: DataTypes.INTEGER
    },
    refundStatus: {
        type: DataTypes.STRING
    },
    subvention: {
        type: DataTypes.STRING
    },
    merchant: {
        type: DataTypes.STRING
    },
    loanId: {
        type: DataTypes.STRING
    },
    loanStatus: {
        type: DataTypes.STRING
    },
    merchantType: {
        type: DataTypes.STRING
    },
    settlementStatus: {
        type: DataTypes.STRING
    },
    transactionType: {
        type: DataTypes.STRING
    },
    readyForDisburse: {
        type: DataTypes.STRING
    },
    downpaymentAmount: {
        type: DataTypes.FLOAT
    },
    FLDGReason: {
        type: DataTypes.STRING
    },
    applicantEmail: {
        type: DataTypes.STRING
    },
    applicantName: {
        type: DataTypes.STRING
    },
    applicationType: {
        type: DataTypes.STRING
    },
    downpaymentRefundTime: {
        type: DataTypes.DATE
    },
    downpaymentRefundStatus: {
        type: DataTypes.STRING
    },
    settlementMerchantId: {
        type: DataTypes.STRING
    },
    settlementMerchantName: {
        type: DataTypes.STRING
    }
});

module.exports = Fibe;

