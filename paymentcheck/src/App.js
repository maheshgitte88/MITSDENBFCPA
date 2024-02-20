import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import "./App.css";
import GrerqUploadStatement from "./Comp/GrerqUploadStatement";
import { toast } from 'react-toastify';
function App() {
  const [data, setData] = useState(null);
  const [report, setReport] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://65.1.54.123:9000/api/loanFeeTransactions")
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [report]);
  console.log(data)

  const headers = [
    { label: "Date of Payment", key: "date_of_Payment" },
    { label: "Mode of Payment", key: "mode_of_payment" },
    { label: "MITSDE Bank Name", key: "MITSDE_Bank_Name" },
    { label: "Instrument No", key: "instrument_No" },
    { label: "Amount", key: "amount" },
    { label: "Clearance Date", key: "clearance_Date" },
    { label: "Student Name", key: "student_Name" },
    { label: "Student Email ID", key: "student_Email_ID" },
    { label: "Student Mobile No", key: "student_Mobile_No" },
    { label: "Course Name", key: "course_Name" },
    { label: "Finance Charges", key: "finance_charges" },
    { label: "Bank TranId", key: "Bank_tranId" },
    { label: "Transaction Remarks", key: "transactionRemarks" },
  ];

  const todayDate = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    todayDate
  );

  const generateReport = async () => {
    setLoading(true); // Set loading to true when starting the process

    try {
      await axios.get("http://65.1.54.123:9000/api/greaquest-only-data");
      await axios.get("http://65.1.54.123:9000/api/propelled-only-data");
      await axios.get("http://65.1.54.123:9000/api/Fibe-only-data");
      setReport(true);
      toast.success("Congratulations! Report Generated Successfully..!");
    } catch (error) {
      toast.error("Error generating report..!");
      console.error("Error generating report:", error);
    } finally {
      setLoading(false); // Set loading to false when the process is completed
    }
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand text-white ps-3" href="/">
          <img
            style={{ width: "150px" }}
            src="https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png"
            alt='logo'
          />
        </a>
      </nav>

      <div className="d-flex justify-content-around">
        {data && data.length > 0 && (
          <button
            className="btn btn-primary"
            data-toggle="tooltip"
            data-placement="top"
            title="This Button Only Download Tracker"
          >
            <CSVLink
              className="text-white"
              data={data}
              headers={headers}
              filename={`${formattedDate}_Only_Tracker.csv`}
            >
              Download Tracker
            </CSVLink>
          </button>
        )}

        <button
          className="btn btn-primary"
          data-toggle="tooltip"
          data-placement="top"
          title="This Button Only genrate Tracker, Click only if not genrated Today"
          onClick={generateReport}
        >
          {loading ? <><div className="spinner-border text-warning" role="status">
            <span className="sr-only">Loading...</span>
          </div></> : "Generate Traker"}
        </button>
      </div>
      <GrerqUploadStatement />
    </div>
  );
}

export default App;
