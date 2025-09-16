import Header from "@/components/header";
import { redirect } from 'next/navigation';

// import Metrics from "@/components/metrics";
// import Summary from "@/components/summary";
// import Transactions from "@/components/transctions";



export default function Home() {
   redirect('/cashflow');

  return (
  <div className="min-h-screen bg-gray-50">
    <Header/>
      {/* This is the div that centers the content.
          All your components should be inside here. */}
           {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"> */}
          <div className="lg:col-span-2 space-y-6">
         
             {/* <Summary />
            <Metrics />
            <Transactions /> */}
               </div>
          {/* Optional sidebar content */}
        {/* </div> */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* <Header /> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
         
          </div>
          {/* Optional sidebar content */}
        </div>
      </div>
    </div>
  );
}
