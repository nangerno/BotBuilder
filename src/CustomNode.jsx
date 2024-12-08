import React from 'react';
import { Handle } from 'react-flow-renderer';

const CustomNode = ({ data }) => (
  <div className="custom-node">
    <strong>{data.label}</strong>
    <Handle type="source" position="bottom" id="a" />
    <Handle type="target" position="top" id="b" />
  </div>
);

export default CustomNode;
