import React from "react";
import Link from "next/link";
function Header() {
  return (
    <header className='navbar fixed-ian'>
      <div className='header-container'>
        <Link href='/' className='header__link'>
          <h2 className='header__title'>STREETPOST</h2>
        </Link>

        <ul className='header__menu'>
          <li className='header__link'>
            <Link href='/new' className='header__link'>
              <p className='navlink'>Notes</p>
            </Link>
          </li>
          <li className='header__link'>
            <Link href='/mosaic' className='header__link'>
              <p className='navlink'>Mosaic</p>
            </Link>
          </li>
          <li className='header__link'>
            <Link href='/map' className='header__link'>
              <p className='navlink'>Map</p>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
export default Header;
