import React from 'react';
import { useTitle } from 'react-use';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div``;

function Page({ documentTitle, children, ...rest }) {
  useTitle(documentTitle);

  return <Wrapper {...rest}>{children}</Wrapper>;
}

Page.propTypes = {
  documentTitle: PropTypes.string,
  children: PropTypes.node,
};

Page.defaultProps = {
  documentTitle: '',
  children: null,
};

export default Page;
