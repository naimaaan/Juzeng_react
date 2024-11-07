import React from 'react';
import logo from '/public/images/juzenglogo.jpg';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
const DocumentsPage = () => {
  const documents = [
    { id: 1, title: 'Document 1', link: '/path/to/document1.pdf' },
    { id: 2, title: 'Document 2', link: '/path/to/document2.pdf' },
    { id: 3, title: 'Document 3', link: '/path/to/document3.pdf' },
    { id: 4, title: 'Document 4', link: '/path/to/document4.pdf' },
  ];

  const handleAddDocument = () => {
    // Logic to add a new document (e.g., open a modal for upload)
    alert('Add Document functionality goes here');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
        <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Dashboard" />

        {/* Content Body */}
        <main className="flex-grow p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl mb-4">
                  545x621
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                <a href={doc.link} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Read
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
