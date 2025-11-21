"use client";

import React from "react";

const Revenue: React.FC = () => {
  const mockRevenue = [
    { month: "January", amount: 12000 },
    { month: "February", amount: 15000 },
    { month: "March", amount: 18000 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">Revenue & Billing</h1>
      <table className="w-full border border-gray-200 rounded-lg text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Month</th>
            <th className="p-3 text-left">Revenue ($)</th>
          </tr>
        </thead>
        <tbody>
          {mockRevenue.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-3">{item.month}</td>
              <td className="p-3">{item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Revenue;
