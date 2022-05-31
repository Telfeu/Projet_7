import React, { Component } from "react";
import axios from "axios";
import { withCookies, Cookies } from "react-cookie";

export default class FilesUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      profileImg: "",
    };
  }

  onFileChange(e) {
    this.setState({ profileImg: e.target.files[0] });
  }
  onSubmit(e) {
    const formData = new FormData();
    const { accessToken } = this.state;
    formData.append("picture", this.state.profileImg);
    axios
      .put("http://localhost:3001/auth/changepicture", formData, {
        headers: {
          accessToken: accessToken,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <form className=" d-flex m-0 p-0" onSubmit={this.onSubmit}>
            <input type="file" name="picture" onChange={this.onFileChange} />

            <button className="btn btn-primary" type="submit">
              Upload
            </button>
          </form>
        </div>
      </div>
    );
  }
}
