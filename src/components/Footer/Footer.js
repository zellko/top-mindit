import React from 'react';
import './Footer.css';
import githubIcon from '../../img/github.png';

function Footer() {
  return (
    <div className="footer">
      <p>
        ©2021 Zellkoss
        {' '}
        {new Date().getFullYear()}
        <a href="https://github.com/zellko/top-mindit">
          <img src={githubIcon} alt="Github link" />
        </a>
      </p>
    </div>
  );
}

export default Footer;
