// src/components/Footer.jsx
export default function Footer({ darkMode }) {
  return (
    <footer className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'} border-t mt-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by{' '}
            <a
              href="https://instagram.com/frannrocchia"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold transition ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              @frannrocchia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}