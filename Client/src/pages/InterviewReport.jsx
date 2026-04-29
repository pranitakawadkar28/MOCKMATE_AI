import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getInterviewReport } from "../features/interview/interviewThunks";
import Step3Report from "../components/Step3Report";

const InterviewReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { result: report, loading } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(getInterviewReport(id));
  }, [dispatch, id]);

  if (loading || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }

  return <Step3Report report={report} />;
};

export default InterviewReport;
