import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StockService } from '../services/stocks/stocks.service';
import Details from './Details';

interface Stock {
  ticker: string;
  name: string;
}

const SearchComponent: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null); // Track selected stock
  const navigate = useNavigate(); // Use useNavigate for navigation
  const stockService = new StockService();

  useEffect(() => {
    if (searchInput) {
      setIsLoading(true);
      stockService.searchStocks(searchInput)
        .then(data => {
          setIsLoading(false);
          if (!data || data.length === 0) {
            toast.error('No results found!', { position: 'bottom-center' });
            setFilteredStocks([]);
          } else {
            setFilteredStocks(data);
          }
        })
        .catch(error => {
          setIsLoading(false);
          toast.error('Error loading data!', { position: 'bottom-center' });
        });
    } else {
      setFilteredStocks([]);
    }
  }, [searchInput]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleOptionSelected = (event: React.SyntheticEvent, stock: Stock | null) => {
    if (stock) {
      setSelectedStock(stock); // Update selected stock
    //   navigate(`/details/${stock.ticker}`);
    }
  };

  return (
    <div className=" h-screen">
      <form className="mt-3 container mx-auto text-center">
        <div className="p-4 border-4 rounded-xl inline-block shadow-lg bg-transparent">
          <Autocomplete
            id="searchInput"
            options={filteredStocks}
            getOptionLabel={(option) => `${option.ticker} | ${option.name}`}
            onChange={handleOptionSelected}
            renderInput={(params) => (
              <TextField
                {...params}
                value={searchInput}
                onChange={handleSearchInput}
                variant="standard"
                className="h-10 w-64 px-4 outline-none border-none text-base text-center bg-transparent"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress size={20} /> : (
                        <IconButton type="submit">
                          <SearchIcon />
                        </IconButton>
                      )}
                    </>
                  ),
                  placeholder: 'Enter Stock Name',
                  className: isDarkMode ? 'placeholder-white text-white' : 'placeholder-primary text-black',
                }}
              />
            )}
          />
        </div>
      </form>
      {selectedStock && <Details tickerSymbol={selectedStock.ticker}/>} {/* Render Details only if a stock is selected */}
    </div>
  );
};

export default SearchComponent;
