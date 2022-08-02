import React, { Component } from "react";
import axios from "axios";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

class FilesUploadComponent extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    library.add(fab, faCamera);

    const { cookies } = props;
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      profileImg: "",
      accessToken: cookies.get("accessToken"),
    };
  }

  onFileChange(e) {
    this.setState({ profileImg: e.target.files[0] });

    this.onSubmit(e);
  }
  onSubmit(e) {
    if (e.target.files[0].size < 2097152) {
      const formData = new FormData();
      const { accessToken } = this.state.accessToken;
      formData.append("picture", e.target.files[0]);
      axios
        .put("http://localhost:3001/auth/changepicture", formData, {
          headers: {
            accessToken: this.state.accessToken,
          },
        })
        .then((res) => {
          window.location.reload(false);
        })
        .catch((err) => window.alert(err));
    } else {
      window.alert("Le fichier est trop lourd");
    }
  }
  render() {
    return (
      <form className=" d-flex m-0 p-0 text-dark">
        <label htmlFor="profile__picture">
          <FontAwesomeIcon
            icon="fa-solid fa-camera"
            className="upload__picture"
          />
        </label>
        <input
          type="file"
          id="profile__picture"
          name="picture"
          onChange={this.onSubmit}
          required
        />
      </form>
    );
  }
}

export default withCookies(FilesUploadComponent);
