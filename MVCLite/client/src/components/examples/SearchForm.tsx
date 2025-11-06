import { SearchForm } from '../SearchForm';

export default function SearchFormExample() {
  const handleSearch = (filters: any) => {
    console.log('Search executed with filters:', filters);
  };

  const handleReset = () => {
    console.log('Search filters reset');
  };

  return (
    <div className="p-4">
      <SearchForm onSearch={handleSearch} onReset={handleReset} />
    </div>
  );
}