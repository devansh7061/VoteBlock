import React from "react";

function Navbar () {
    return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            Vote Block
          </a>
          
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  Login
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

export default Navbar;