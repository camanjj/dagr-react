import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';



export default class InsertItemCategoryView extends React.Component {

  handleSaveBtnClick = () => {
    const { columns, onSave } = this.props;
    const newRow = {};
    columns.forEach((column, i) => {
      newRow[column.field] = this.refs[column.field].value;
    }, this);
    // You should call onSave function and give the new row
    onSave(newRow);
  }

  render() {
    const {
      onModalClose,
      onSave,
      columns,
      validateState,
      ignoreEditable
    } = this.props;
    return (
      <div style={ { backgroundColor: '#eeeeee' } } className='modal-content'>
        <h2 style={ { color: 'red' } }>Custom Insert Modal</h2>
        <div>
          {
            columns.map((column, i) => {
              const {
                editable,
                format,
                field,
                name,
                hiddenOnInsert
              } = column;

              if (hiddenOnInsert) {
                // when you want same auto generate value
                // and not allow edit, for example ID field
                return null;
              }
              const error = validateState[field] ?
                (<span className='help-block bg-danger'>{ validateState[field] }</span>) :
                null;
              return (
                <div className='form-group' key={ field }>
                  <label>{ name } : </label>
                  <input ref={ field } type='text' defaultValue={ '' } />
                  { error }
                </div>
              );
            })
          }
        </div>
        <div>
          <button className='btn btn-danger' onClick={ onModalClose }>Leave</button>
          <button className='btn btn-success' onClick={ () => this.handleSaveBtnClick(columns, onSave) }>Confirm</button>
        </div>
      </div>
    );
  }
}