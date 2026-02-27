import React from "react";
import { BorrowerData } from "../types";

interface ApplicantProfileProps {
  borrower: BorrowerData;
}

export function ApplicantProfile({ borrower }: ApplicantProfileProps) {
  return (
    <div className="col-span-12 md:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-sm uppercase font-semibold text-slate-500 mb-4">Applicant Profile</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400">Full Name</label>
          <div className="font-medium text-lg">{borrower.name}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400">Credit Score</label>
              <div className="font-medium text-slate-800">{borrower.creditScore}</div>
            </div>
            <div>
              <label className="text-xs text-slate-400">Age</label>
              <div className="font-medium text-slate-800">{borrower.age}</div>
            </div>
        </div>
        <div>
          <label className="text-xs text-slate-400">Employment</label>
          <div className="font-medium text-slate-800 truncate">{borrower.employmentStatus}</div>
        </div>
      </div>
    </div>
  );
}
