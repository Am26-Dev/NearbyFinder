# NearbyFinder
A React-based web application that allows users to find nearby places, such as hospitals, based on their entered city or locality.



**Link to project:** https://github.com/Am26-Dev/NearbyFinder

## How It's Made:

**Tech used:** React, CSS, React-Leaflet, OpenStreetMap

This React app was built using React-Leaflet for map rendering and OpenStreetMap for place data. Users can type in any location name, which is matched via a search suggestion feature to help disambiguate between places with the same name. Once the user selects a location, they can choose what type of amenities they want to find nearby—such as schools, malls, hospitals, or banks—and the app fetches and displays relevant results on the interactive map. All functionality is handled on the frontend using public APIs and open-source packages.

## Optimizations

Currently, the app requires users to manually search for a location, but this can be optimized by integrating the browser's Geolocation API to automatically detect and center the map on the user's current position.The number of nearby amenities returned may vary depending on the data available from the open-source APIs in use. While they provide a solid foundation for location-based features, integrating additional data sources or premium services in the future could enhance result coverage and improve the overall experience.


## Lessons Learned:

While building this app, I got the opportunity to work with technologies like React-Leaflet and OpenStreetMap for the first time, which gave me valuable insights into how mapping libraries and location-based services function. It was a great learning experience in integrating third-party APIs, managing user-driven search flows, and rendering real-time data on interactive maps — all within a frontend-only setup. There's still a lot more to learn, especially when it comes to optimizing performance, improving data accuracy, and exploring more advanced mapping features, but this project has been a strong step forward in that journey.