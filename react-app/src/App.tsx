import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { DestinationsPage } from "./pages/DestinationsPage";
import { DestinationDetailPage } from "./pages/DestinationDetailPage";
import { DealsPage } from "./pages/DealsPage";
import { UmrahPage } from "./pages/UmrahPage";
import { ContactPage } from "./pages/ContactPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route
            path="/destinations/:slug"
            element={<DestinationDetailPage />}
          />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/umrah" element={<UmrahPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
