import Head from "next/head";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import MapSidebar from "../components/MapSidebar";
import { useRecoilState } from "recoil";
import { modalState, locationState } from "../atoms/modalAtom";
import { useLocationState } from "../atoms/modalAtom";
import trendingResults from "../trending.json";
import followResults from "../follow.json";
import GetUserLocation from "../components/GetUserLocation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import MobilePigeon from "../components/MobilePigeon";

const Home = ({ providers }) => {
  const getUserLocation = () => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position) => {
      console.log("Location obtained:", position.coords);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let trimLat = latitude.toFixed(4);
      let trimLong = longitude.toFixed(4);

      setLat(trimLat);
      setLng(trimLong);
      setLocation([trimLat, trimLong]);
    };

    const error = (err) => {
      console.error("Error getting location:", err.code, err.message);

      switch (err.code) {
        case err.PERMISSION_DENIED:
          alert("Location permission denied. Please enable location access in your browser settings.");
          break;
        case err.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case err.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        default:
          alert("An unknown error occurred while getting your location.");
          break;
      }
    };

    // Request location with options for better accuracy and timeout
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    console.log("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [location, setLocation] = useRecoilState(locationState);
  const [mapIsOpen, setMapIsOpen] = useState(false);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    getUserLocation();
  }, [session]);
  const storeNotes = (notes) => {
    setNotes(notes);
  };

  const toggleMap = () => {
    setMapIsOpen(!mapIsOpen);
  };

  const hideMap = () => {
    setMapIsOpen(false);
  };


  return (
    <div className=''>
      <Head>
        <title>Streetpost</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='min-h-screen flex max-w-[1900px] mx-auto'>
        {mapIsOpen && <MobilePigeon hideMap={hideMap} notes={notes} />}
        <Sidebar />

        <Feed
          getUserLocation={getUserLocation}
          location={location}
          storeNotes={storeNotes}
          toggleMap={toggleMap}
          hideMap={hideMap}
        />

        {/* Permanent Map Sidebar - Desktop Only */}
        <MapSidebar notes={notes} />

        {/* Modal */}
        {isOpen && <Modal />}
      </main>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context) {
  /*  const https = require("https");
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV", {
    agent: agent,
  }).then((res) => res.json());
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ", {
    agent: agent,
  }).then((res) => res.json()); */
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      /*  trendingResults,
      followResults, */
      providers,
      session,
    },
  };
}
