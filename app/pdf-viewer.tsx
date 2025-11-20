'use client';

import { useState } from 'react';
import { useAuth } from './auth-context';
import documentsDataRaw from './documents.json';

export type PDFDocument = {
  id: string;
  name: string;
  description: string;
  file: string;
  thumbnail?: string;
};

const documentsData = documentsDataRaw as PDFDocument[];

export function PDFViewer() {
  const [selectedPDF, setSelectedPDF] = useState<PDFDocument | null>(null);
  const { logout } = useAuth();

  const handleViewPDF = (pdf: PDFDocument) => {
    setSelectedPDF(pdf);
  };

  const handleDownloadPDF = (pdf: PDFDocument) => {
    const link = document.createElement('a');
    link.href = pdf.file;
    link.download = pdf.name + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeViewer = () => {
    setSelectedPDF(null);
  };

  // Show message if no documents are found
  if (!documentsData || documentsData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Documents Found</h2>
          <p className="text-gray-600">No PDF documents were found in the documents folder.</p>
          <p className="text-gray-600 mt-2">Please add PDF files to the public/documents/ directory and rebuild the application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">🚁 Drone Documents</h1>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors touch-manipulation min-h-[44px]"
            >
              <svg className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="py-4 sm:py-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documentsData.map((pdf) => (
              <div key={pdf.id} className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation" onClick={() => handleViewPDF(pdf)}>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-blue-100 mb-4 sm:mb-6 mx-auto">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center leading-tight min-h-[3rem] sm:min-h-[4rem] flex items-center">
                    <span className="line-clamp-2">{pdf.name}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed min-h-[2.5rem] sm:min-h-[3rem] flex items-center">
                    <span className="line-clamp-2">{pdf.description}</span>
                  </p>

                  <div className="flex flex-col space-y-2 sm:space-y-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewPDF(pdf); }}
                      className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-h-[44px] touch-manipulation"
                    >
                      <span className="mr-2">📖</span>
                      <span className="truncate">View Document</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownloadPDF(pdf); }}
                      className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-h-[44px] touch-manipulation"
                    >
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate">Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 overflow-hidden z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full max-w-7xl max-h-screen bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col">
            {/* Mobile-friendly header */}
            <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 border-b flex-shrink-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate pr-2 sm:pr-4">
                {selectedPDF.name}
              </h3>
              <button
                onClick={closeViewer}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close viewer"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PDF Content Area - takes remaining space */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedPDF.file}
                className="w-full h-full border-0"
                title={selectedPDF.name}
                style={{ minHeight: 'calc(100vh - 120px)' }}
              />
            </div>

            {/* Mobile-friendly bottom controls */}
            <div className="bg-white border-t p-3 sm:p-4 flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
              <button
                onClick={() => handleDownloadPDF(selectedPDF)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors touch-manipulation"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={closeViewer}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors touch-manipulation"
              >
                ✕ Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
