import React, { Suspense } from "react";
import VerifyOTPClient from "./VerifyOTPClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOTPClient />
    </Suspense>
  );
}