const express = require('express');
const cors = require('cors');
const app = express();
const GreaquestRoutes = require('./Routes/Greaquest');
const IciciRoutes = require('./Routes/IciciBank');
const Propelled = require('./Routes/Propelled')

const sequelize = require('./config');
const LoanFeeOnlyTranstions = require('./Models/LoanFeeOnlyTranstions');
const FeeFromLoanTracker = require('./Models/FeeFromLoanTracker');

app.use(express.json());
app.use(cors());

sequelize.sync().then(() => {
  console.log('Database synced.');
});

app.use('/api', GreaquestRoutes);
app.use('/api', IciciRoutes);
app.use('/api', Propelled);

app.get('/api/loanFeeTransactions', async (req, res) => {
  try {
    const transactions = await LoanFeeOnlyTranstions.findAll();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/FeeFromLoanTracker', async (req, res) => {
  try {
    console.log("api hit")
    const transactions = await FeeFromLoanTracker.findAll();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/transaction/mob/:studentMobileNo', async (req, res) => {
  const studentMobileNo = req.params.studentMobileNo;

  try {
    const transaction = await LoanFeeOnlyTranstions.findOne({
      attributes: [
        'id',
        'date_of_Payment',
        'mode_of_payment',
        'instrument_No',
        'amount',
        'clearance_Date',
        'student_Name',
        'student_Email_ID',
        'student_Mobile_No',
        'course_Name',
        'finance_charges',
        'Bank_tranId'
      ],
      where: { student_Mobile_No: studentMobileNo }
    });

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/transaction/email/:student_Email_ID', async (req, res) => {
  const studentEmailId = req.params.student_Email_ID;

  try {
    const transaction = await LoanFeeOnlyTranstions.findOne({
      attributes: [
        'id',
        'date_of_Payment',
        'mode_of_payment',
        'instrument_No',
        'amount',
        'clearance_Date',
        'student_Name',
        'student_Email_ID',
        'student_Mobile_No',
        'course_Name',
        'finance_charges',
        'Bank_tranId'
      ],
      where: { student_Email_ID: studentEmailId }
    });

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: `Student Transaction not found with ${studentEmailId}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/all-nbfc-transactions', async (req, res) => {
  try {
    const transactions = await LoanFeeOnlyTranstions.findAll({
      attributes: [
        'id',
        'date_of_Payment',
        'mode_of_payment',
        'instrument_No',
        'amount',
        'clearance_Date',
        'student_Name',
        'student_Email_ID',
        'student_Mobile_No',
        'course_Name',
        'finance_charges',
        'Bank_tranId'
      ]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/em-transaction', async (req, res) => {
  const { email, mobile } = req.query;

  try {
    let whereClause = {};

    if (email) {
      whereClause.student_Email_ID = email;
    }

    if (mobile) {
      whereClause.student_Mobile_No = mobile;
    }

    const transaction = await LoanFeeOnlyTranstions.findOne({
      attributes: [
        'id',
        'date_of_Payment',
        'mode_of_payment',
        'instrument_No',
        'amount',
        'clearance_Date',
        'student_Name',
        'student_Email_ID',
        'student_Mobile_No',
        'course_Name',
        'finance_charges',
        'Bank_tranId'
      ],
      where: whereClause
    });

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: 'Student Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
