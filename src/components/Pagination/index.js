import React from 'react';
import PropTypes from 'prop-types';
import { ContainerPagination } from './styles';

const Pagination = ({ page, changePage }) => {
  return (
    <ContainerPagination>
      {page !== 1 ? (
        <input type="button" onClick={() => changePage('-')} value="Previous" />
      ) : null}
      <p> Page {page}</p>
      <input type="button" onClick={() => changePage('+')} value="Next" />
    </ContainerPagination>
  );
};

Pagination.propTypes = {
  changePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

export default Pagination;
