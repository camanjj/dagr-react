import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import $ from 'jquery';
import Modal from 'react-modal';
import Select from 'react-select';
import InsertItemCategoryView from './InsertItemCategoryView'

class CategoryView extends Component {
  constructor() {
    super()

    this.showModal = this
      .showModal
      .bind(this)
    this.parentChange = this
      .parentChange
      .bind(this);
    this.createCategory = this
      .createCategory
      .bind(this);
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleCategoryRowSelect = this
      .handleCategoryRowSelect
      .bind(this);
    this.addDagrToCategory = this.addDagrToCategory.bind(this)

    this.state = {
      categories: [],
      loading: true,
      parentCategory: null,
      categoryName: "",
      modalOpen: false,
      selectedCategory: null,
      itemInsertModalOpen: false,
      categoryDagrs: [],
      allDagrs: [],
      selectedDagr: null
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

  fetchDagrsForCategoryInsert() {
    return $
      .getJSON(`${process.env.REACT_APP_URL}/dagr`)
      .then((data) => {
        this.setState({allDagrs: data, loading: false});
      });
  }

  refreshView() {
    this.setState({
      categories: [],
      loading: true,
      parentCategory: null,
      categoryName: "",
      modalOpen: false,
      selectedCategory: null,
      itemInsertModalOpen: false,
      categoryDagrs: [],
      allDagrs: [],
      selectedDagr: null
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
    event.preventDefault();
    const categoryName = this.state.categoryName;

    var payload = {
      name: categoryName
    }

    if (this.state.parentCategory) {
      payload.parent_id = this.state.parentCategory.id
    }

    $
      .ajax({
      type: 'POST',
      dataType: 'json',
      contentType: "application/json",
      url: `${process.env.REACT_APP_URL}/category`,
      data: JSON.stringify(payload)
    })
      .then((data, status, xhr) => {
        this.refreshView()
      })
  }

  addDagrToCategory(event) {
    event.preventDefault()
    $
      .ajax({
      type: 'POST',
      dataType: 'json',
      contentType: "application/json",
      url: `${process.env.REACT_APP_URL}/category/${this.state.selectedCategory.id}/dagr`,
      data: JSON.stringify({dagrId: this.state.selectedDagr.id})
    })
      .then((data, status, xhr) => {
        this.setState({selectedDagr: null})
        this.refreshView()
    })
  }

  // Delete Button stuff
  handleDeleteButtonClick = (onClick) => {
        $
      .ajax({
      type: 'POST',
      dataType: 'json',
      contentType: "application/json",
      url: `${process.env.REACT_APP_URL}/category/dagr/remove`,
      data: JSON.stringify({dagrId: this.state.selectedDagr.id})
    })
      .then((data, status, xhr) => {
        this.setState({selectedDagr: null})
        this.refreshView()
    })
  }

  createCustomDeleteButton = (onClick) => {
    return (
      <button type="button" className="btn btn-warning" onClick={ () => this.handleDeleteButtonClick(onClick) }>Remove item from Category</button>
    );
  }

  // insert button stuff
  createCustomInsertButton = (onClick) => {
    return (
      <button type="button" className="btn btn-primary" onClick={ () => { this.fetchDagrsForCategoryInsert(); this.setState({itemInsertModalOpen:true})} }>Add Item to Category</button>
    );
  }

  createCustomModal = (onModalClose, onSave, columns, validateState, ignoreEditable) => {
    const attr = {
      onModalClose, onSave, columns, validateState, ignoreEditable
    };
    return (
      <InsertItemCategoryView { ... attr } />
    );
  }

  // updates the category name text field in the create modal
  handleChange(event) {
    this.setState({categoryName: event.target.value});
  }

  handleCategoryRowSelect(row, isSelected, e) {
    this.setState({selectedCategory: row})
    return $
      .getJSON(`${process.env.REACT_APP_URL}/category/${row.id}/dagr`)
      .then((data) => {
        this.setState({categoryDagrs: data, loading: false});
      });
  }

  render() {

    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.handleCategoryRowSelect
    };

    const dagrTableOptions = {
      deleteBtn: this.createCustomDeleteButton,
      insertBtn: this.createCustomInsertButton,
      insertModal: this.createCustomModal
    };

    const selectDagrRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelected, e) => { if (isSelected) this.setState({selectedDagr: row}); console.log(row) }
    }

    // map the parent Id to the parent's name
    const format = (cell, row) => {
      if (!row.parent_id)
        return cell
      return this.state.categories.find((value) => value.id === row.parent_id).name
    }

    const addItemModel = () => this.setState({itemInsertModalOpen: false})
    const insertCategoryModal = () => this.setState({modalOpen: false})

    return (
      <div>
        <h2>Categories</h2>
        <div className="container">
          <div className="row">
            {/*Category List*/}
            <div className="col-xs-6">
              <BootstrapTable
                data={this.state.categories}
                striped={true}
                hover
                pagination
                selectRow={selectRowProp}
                dataFormat={format}
                search>
                <TableHeaderColumn dataField="id" isKey hidden>Category Id</TableHeaderColumn>
                <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
                <TableHeaderColumn dataField="parent_id" dataFormat={format}>Parent</TableHeaderColumn>
              </BootstrapTable>
              <div className="btn-group" role="group" aria-label="...">
                <button type="button" className='btn btn-primary' onClick={this.showModal}>+Category</button>
              </div>
            </div>
            <div className="col-xs-6">
              <h3>Related Dagrs</h3>
              <BootstrapTable data={this.state.categoryDagrs} options={dagrTableOptions} deleteRow insertRow selectRow={selectDagrRowProp} striped={true} hover pagination>
                <TableHeaderColumn dataField="id" isKey hidden>Id</TableHeaderColumn>
                <TableHeaderColumn dataField="file_alias">Alias</TableHeaderColumn>
                <TableHeaderColumn dataField="file_name">File Name</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
        </div>
        {/*Create Category Modal*/}
        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="Add Category"
          onRequestClose={insertCategoryModal}
          shouldCloseOnOverlayClick={true}>
          <div className="container">
            <form className="col-md-6 col-md-offset-3" onSubmit={this.createCategory}>
              <div className="form-group">
                <label>Category Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.categoryName}
                  placeholder="Category Name"
                  onChange={this.handleChange}/>

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
        <Modal
          isOpen={this.state.itemInsertModalOpen}
          contentLabel="Add DAGR"
          onRequestClose={addItemModel}
          shouldCloseOnOverlayClick={true}>
          <div className="container">
            <form className="col-md-6 col-md-offset-3" onSubmit={this.addDagrToCategory}>
              <div className="form-group">
                <label>Dagr</label>

                <Select
                  name="form-field-name"
                  value={this.state.selectedDagr}
                  onChange={ (val) => this.setState({selectedDagr: val}) }
                  labelKey="file_name"
                  valueKey="id"
                  options={this.state.allDagrs.filter((value) => value.category_id == null)}/>

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