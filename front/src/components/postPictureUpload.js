import React, { Component } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

console.log(window.location.pathname);
const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

export default class FilesUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      postPicture: "",
    };
  }

  onFileChange(e) {
    this.setState({ postPicture: e.target.files[0] });
  }
  onSubmit(e) {
    const formData = new FormData();
    formData.append("picture", this.state.postPicture);
    axios
      .put("http://localhost:3001/posts", formData, {
        headers: {
          accessToken: cookies.accessToken,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
  render() {
    return <input type="file" name="picture" onChange={this.onFileChange} />;
  }
}
