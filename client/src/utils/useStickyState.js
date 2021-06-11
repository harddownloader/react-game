import React, { useState, useEffect } from 'react';

// сохраняем стейт в localStorage
function useStickyState(defaultValue, key) {

    const [value, setValue] = useState(() => {
      const stickyValue = process.browser ? window.localStorage.getItem(key) : null;
      return stickyValue !== null
        ? JSON.parse(stickyValue)
        : defaultValue;
    });
    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

export default useStickyState;
