// modules/Repo.js
import React from 'react'

export default React.createClass({
  render() {
      console.info(JSON.stringify(this.props));
    return (
      <div>
        <h2>{this.props.params.repoName}</h2>
      </div>
    )
  }
})
