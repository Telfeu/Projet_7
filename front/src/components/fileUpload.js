import React, { Component } from "react";
import axios from "axios";

console.log(window.location.pathname);

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
    formData.append("picture", this.state.profileImg);
    axios
      .put("http://localhost:3001/auth/changepicture", formData, {
        headers: {
          accessToken: document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            .split("=")[1],
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
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input type="file" name="picture" onChange={this.onFileChange} />
            </div>
            <div className="form-group">
              <button className="btn btn-primary" type="submit">
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
