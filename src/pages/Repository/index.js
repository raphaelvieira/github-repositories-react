import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { Loading, Owner, IssueList, Filter } from './styles';
import Container from '../../components/Container/index';
import Pagination from '../../components/Pagination';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 1,
    filter: 'all',
  };

  async componentDidMount() {
    this.loadRepository();
  }

  // save data to localStorage
  componentDidUpdate(_, prevState) {
    const { page } = this.state;

    if (prevState.page !== page) {
      this.loadRepository();
    }
  }

  handlePageChange = button => {
    const { page } = this.state;
    const newPage = button === '+' ? page + 1 : page - 1;
    this.setState({ page: newPage });
  };

  handleFilter = async e => {
    await this.setState({ filter: e.target.value });
    this.loadRepository();
  };

  async loadRepository() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { page, filter } = this.state;
    /**
     * execute 2 requests at the same time and wait for all responses */
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        // query params
        params: {
          page,
          state: filter,
          per_page: 5,
        },
      }),
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Filter>
          <h1>Filter Status</h1>
          <select onChange={this.handleFilter}>
            <option id="all" value="all">
              All
            </option>
            <option id="open" value="open">
              Open
            </option>
            <option id="closed" value="closed">
              Closed
            </option>
          </select>
        </Filter>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination page={page} changePage={this.handlePageChange} />
      </Container>
    );
  }
}
