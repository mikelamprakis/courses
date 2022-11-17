import React from "react";

// Instead of creating this custom wrapper for the purpose of wrapping the multiple elements of jsx
// we could instead use <></>, a <div> , React.Fragment or just Fragment
const Wrapper = props => {
    return props.children;
}

export default Wrapper;