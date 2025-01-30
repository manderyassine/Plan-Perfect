import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  SunIcon, 
  CloudIcon, 
  CloudRainIcon, 
  SnowflakeIcon, 
  CloudSunIcon 
} from 'lucide-react';

const DateTimeWeather = ({ userLocation }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temperature: 20,
    description: 'Clear',
    location: 'Local'
  });
  const [error, setError] = useState(null);

  // Detailed location and error logging
  useEffect(() => {
    console.log('DateTimeWeather Location Debug:', {
      userLocation,
      locationCity: userLocation?.city,
      locationCountry: userLocation?.country,
      locationType: typeof userLocation
    });
  }, [userLocation]);

  // Date and Time Update
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Weather Fetch based on user location
  const fetchWeather = async () => {
    const apiKey = process.env.REACT_APP_WEATHERAPI_KEY;
    
    // Detailed logging for weather fetch
    console.log('Weather Fetch Inputs:', {
      apiKey: apiKey ? 'Key Present' : 'No Key',
      userLocation
    });
    
    // If no user location is provided, skip weather fetch
    if (!userLocation || !userLocation.city) {
      console.warn('No location provided for weather fetch');
      setError('No location set');
      return;
    }

    if (!apiKey) {
      console.error('WeatherAPI key is missing');
      setError('No API key found');
      return;
    }

    try {
      // Fetch weather using user's city
      const weatherResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${userLocation.city}&aqi=no`
      );

      console.log('Full Weather Response:', weatherResponse.data);

      const weatherData = weatherResponse.data.current;
      
      setWeather({
        temperature: Math.round(weatherData.temp_c),
        description: weatherData.condition.text,
        location: weatherResponse.data.location.name || userLocation.city,
        icon: weatherData.condition.icon
      });
      setError(null);
    } catch (error) {
      console.error('Weather fetch full error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        setError(`API Error: ${error.response.status} - Unable to fetch weather for ${userLocation.city}`);
      } else {
        setError(`Weather fetch error for ${userLocation.city}`);
      }
    }
  };

  // Fetch weather when user location changes
  useEffect(() => {
    fetchWeather();
  }, [userLocation]);

  // Weather icon selection
  const getWeatherIcon = (description) => {
    const iconMap = {
      'Sunny': SunIcon,
      'Clear': SunIcon,
      'Partly cloudy': CloudSunIcon,
      'Cloudy': CloudIcon,
      'Overcast': CloudIcon,
      'Mist': CloudIcon,
      'Patchy rain possible': CloudRainIcon,
      'Rain': CloudRainIcon,
      'Thundery outbreaks possible': CloudRainIcon,
      'Snow': SnowflakeIcon,
      'default': CloudSunIcon
    };

    return iconMap[description] || iconMap['default'];
  };

  // Format date and time
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const WeatherIcon = getWeatherIcon(weather.description);

  return (
    <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
      {/* Date and Time */}
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {formatDate(dateTime)}
        </span>
        <span className="text-lg font-bold">
          {formatTime(dateTime)}
        </span>
      </div>

      {/* Weather */}
      <div className="flex items-center space-x-2">
        {weather.icon ? (
          <img 
            src={`https:${weather.icon}`} 
            alt={weather.description} 
            className="w-6 h-6"
          />
        ) : (
          <WeatherIcon className="w-6 h-6" />
        )}
        <div className="flex flex-col">
          {error ? (
            <span className="text-xs text-red-500">{error}</span>
          ) : (
            <>
              <span className="text-sm font-medium">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {weather.location}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeWeather;
