import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import $ from 'jquery';
import Modal from 'react-modal';
import Select from 'react-select';

class CategoryView extends Component {
  constructor() {
    super()
    
    this.showModal = this.showModal.bind(this)
    this.parentChange = this.parentChange.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      categories: [],
      loading: true,
      parentCategory: null,
      categoryName: "",
      modalOpen: false
    }
  }

  componentDidMount() {
    this.CategoryList()
  }

  CategoryList() {
    return $
      .getJSON(`${process.env.REACT_APP_URL}/category`)
      .then((data) => {
        this.setState({categories: data, loading: false});
      });
  }

  refreshView() {
    this.setState({
      categories: [],
      loading: true,
      parentCategory: null,
      categoryName: "",
      modalOpen: false
    })
    this.CategoryList()
  }

  showModal() {
    this.setState({modalOpen: true});
  }

  parentChange(val) {
    this.setState({parentCategory: val})
  }

  createCategory(event) {
    const categoryName = this.state.categoryName;
    const parentId = this.state.parentCategory.id || null
    console.log(categoryName)
    console.log(parentId)
    event.preventDefault();
    //TODO send the category

      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        url: `${process.env.REACT_APP_URL}/category`,
        data: JSON.stringify({name:categoryName, parent_id: parentId})
      }).then((data, status, xhr) => {
        this.refreshView()
    })
  }

  handleChange(event) {
    this.setState({categoryName: event.target.value});
  }

  render() {

    return (
      <div>
        <div className="container">
          <div className="row">
            {/*Category List*/}
            <div className="col-md-6 col-md-offset-3">
              <h2>Categories</h2>
              <BootstrapTable
                data={this.state.categories}
                striped={true}
                hover
                pagination
                search>
                <TableHeaderColumn dataField="id" isKey>Category Id</TableHeaderColumn>
                <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
                <TableHeaderColumn dataField="parent_id">Parent</TableHeaderColumn>
              </BootstrapTable>
              <button className='btn btn-primary' onClick={this.showModal}>
                +Category
              </button>
            </div>
          </div>
        </div>
        {/*Create Category Modal*/}
        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="Add Category"
          shouldCloseOnOverlayClick={true}>
          <div className="container">
            <form className="col-md-6 col-md-offset-3" onSubmit={this.createCategory}>
              <div className="form-group">
                <label>Category Name:</label>
                <input
                type="text"
                  className="form-control"
                  value={this.state.categoryName}
                  placeholder="Category Name" onChange={this.handleChange}/>

                <Select
                  name="form-field-name"
                  value={this.state.parentCategory}
                  onChange={this.parentChange}
                  labelKey="name"
                  valueKey="id"
                  options={this.state.categories}/>

              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CategoryView;