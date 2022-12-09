import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Feed from "../components/Feed";
import Login from "../components/Login";
import Modal from "../components/Modal";
import Widgets from "../components/Widgets";
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
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let trimLat = latitude.toFixed(4);
      let trimLong = longitude.toFixed(4);

      let numLat = Number(trimLat);
      let numLng = Number(trimLong);

      setLat(trimLat);
      setLng(trimLong);
      setLocation([trimLat, trimLong]);
    };
    const error = () => {
      console.log("Unable to retrieve your location");
    };

    navigator.geolocation.getCurrentPosition(success, error);
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
  }, []);
  const storeNotes = (notes) => {
    setNotes(notes);
  };

  const toggleMap = () => {
    setMapIsOpen(!mapIsOpen);
  };

  const hideMap = () => {
    setMapIsOpen(false);
  };

  if (!session) return <Login providers={providers} />;
  return (
    <div className=''>
      <Head>
        <title>Streetpost</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='bg-zinc-900 min-h-screen flex max-w-[1500px] mx-auto'>
        {mapIsOpen && <MobilePigeon hideMap={hideMap} notes={notes} />}
        <Sidebar />
        <span className='text-white text-lg'></span>

        <Feed
          getUserLocation={getUserLocation}
          location={location}
          storeNotes={storeNotes}
          toggleMap={toggleMap}
          hideMap={hideMap}
        />
        <Widgets notes={notes} />
        {/* Feed */}
        {/* Widgets */}

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
