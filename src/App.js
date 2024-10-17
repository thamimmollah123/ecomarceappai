// App.js
import './App.css';
import PageRoute from './PageRoute';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <PageRoute />
    </ThemeProvider>
  );
}

export default App;
