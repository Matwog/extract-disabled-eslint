/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types'
import React from 'react'
import i18n from 'i18n'
import _ from 'lodash'
import actions from 'explorer/solman/admin/actions/manageSolManActions'
import constants from 'explorer/solman/admin/types/manageSolMan'
import LoadingSpinnerMask from 'explorer/solman/components/LoadingSpinnerMask'

const { STATUS } = constants

class EditMappingBox extends React.Component {
  static displayName = 'EditMappingBox'

  static propTypes = {
    solManAttributes: PropTypes.object.isRequired,
    selectedProject: PropTypes.object.isRequired,
    status: PropTypes.string,
    mappings: PropTypes.object.isRequired,
    signavioAttributes: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    selectedMapping: PropTypes.object.isRequired,
    mode: PropTypes.string,
  }

  state = {
    selectedSignavioAttribute: '',
    selectedSolManAttribute: '',
  }

  componentWillMount() {
    if (!this.props.solManAttributes[this.props.selectedProject.id]) {
      actions.loadSolManAttributes()
      this.setState({ status: STATUS.LOADING })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.status === STATUS.LOADING &&
      nextProps.status === STATUS.LOAD_OK
    ) {
      this.setState({ status: STATUS.LOAD_OK })
    }
  }

  render() {
    if (
      this.props.status === STATUS.LOADING ||
      this.state.status === STATUS.LOADING
    ) {
      return this.renderLoading()
    }

    switch (this.props.mode) {
      case 'edit':
        return this.renderEditMode()
      case 'add':
        return this.renderAddMode()
      default:
        return null
    }
  }

  generateDropdownSignavioAttributes = () => {
    const arrayForDropdown = []
    const signavioMappings = _.map(
      this.props.mappings[this.props.selectedProject.id],
      'rep.signavioattributeid'
    )
    const unmappedSignavioAttributes = _.omit(
      this.props.signavioAttributes,
      signavioMappings
    )

    // this is done for proper visualization in dropdown
    _.forIn(unmappedSignavioAttributes, function (value, key) {
      arrayForDropdown.push({
        name: value.name,
        id: key,
      })
    })

    return arrayForDropdown
  }

  generateDropdownSolManAttributes = () => {
    const solManAttributes = this.props.solManAttributes[
      this.props.selectedProject.id
    ]
    const sapMappings = _.map(
      this.props.mappings[this.props.selectedProject.id],
      'rep.sapattributekey'
    )
    const unmappedSolManAttributes = _.filter(solManAttributes, function (n) {
      return !_.includes(sapMappings, n)
    })

    return unmappedSolManAttributes.map(function (att) {
      return { id: att }
    })
  }

  selectSignavioAttribute = (selection) => {
    this.setState({
      selectedSignavioAttribute: selection.id,
    })
  }

  selectSolManAttribute = (selection) => {
    this.setState({
      selectedSolManAttribute: selection.id,
    })
  }

  addAttributeMapping = () => {
    if (
      this.state.selectedSolManAttribute &&
      this.state.selectedSignavioAttribute
    ) {
      this.props.close()
      actions.addAttributeMapping(
        this.state.selectedSolManAttribute,
        this.state.selectedSignavioAttribute
      )
    }
  }

  editAttributeMapping = () => {
    if (
      this.state.selectedSolManAttribute ||
      this.state.selectedSignavioAttribute
    ) {
      const params = {
        sapattributekey:
          this.state.selectedSolManAttribute ||
          this.props.selectedMapping.sapattributekey,
        signavioattributeid:
          this.state.selectedSignavioAttribute ||
          this.props.selectedMapping.signavioattributeid,
        id: this.props.selectedMapping.id,
      }
      actions.editAttributeMapping(params)
      this.props.close()
    }
  }

  deleteAttributeMapping = () => {
    if (
      !(
        this.state.selectedSolManAttribute ||
        this.state.selectedSignavioAttribute
      )
    ) {
      actions.deleteAttributeMapping(this.props.selectedMapping.id)
      this.props.close()
    }
  }

  renderLoading = () => (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className='edit-mapping-box'>
      <LoadingSpinnerMask height={98} />
    </div>
  )

  renderAddMode = () => (
    <div className='edit-mapping-box'>
      <div className='text-row'>
        <div className='text-row-text'>
          <div
            style={{
              marginBottom: 10,
              fontWeight: 'bold',
            }}
          >
            {i18n(
              'Select an SAP® Solution Manager® attribute and the corresponding Signavio attribute that should be mapped.'
            )}
          </div>
          <div style={{ marginBottom: 4 }}>
            {i18n(
              'On the left side select any attribute from your SAP® Solution Manager® project.'
            )}
          </div>
          <div style={{ marginBottom: 4 }}>
            {i18n(
              'On the right side select the corresponding Signavio custom attribute defined on either a BPMN 2.0 Task, BPMN 2.0 diagram or value chain diagram.'
            )}
          </div>
        </div>
        <div className='text-row-cancel-button'>
          <i
            className='fa fa-times mapping-box-icon'
            onClick={this.props.close}
          />
        </div>
      </div>
      <div className='selection-row'>
        <div className='mapping-select'>
          <select
            className='input-mapping-selection'
            onChange={this.selectSolManAttribute}
            value={this.state.selectedSolManAttribute || ''}
          >
            {this.generateDropdownSolManAttributes().forEach(({ id = '' }) => (
              <option value={id}>{id}</option>
            ))}
          </select>
        </div>
        <div className='mapping-box-arrow'>
          <i className='fa fa-arrows-h' />
        </div>
        <div className='mapping-select'>
          <select
            className='input-mapping-selection'
            onChange={this.selectSignavioAttribute}
            value={this.state.selectedSignavioAttribute || ''}
          >
            {this.generateDropdownSignavioAttributes().forEach(
              ({ name = '' }) => (
                <option value={name}>{name}</option>
              )
            )}
          </select>
        </div>
      </div>
      <div className='button-row'>
        <button
          disabled={
            !(
              this.state.selectedSolManAttribute &&
              this.state.selectedSignavioAttribute
            )
          }
          className='action-button'
          style={{ marginTop: 10, float: 'right' }}
          onClick={this.addAttributeMapping}
        >
          {i18n('Add attribute mapping')}
        </button>
      </div>
    </div>
  )

  renderEditMode = () => (
    <div className='edit-mapping-box'>
      <div className='text-row'>
        <div className='text-row-text'>
          {i18n(
            'Edit or delete mapping of SAP® Solution Manager® and Signavio attribute.'
          )}
        </div>
        <div className='text-row-cancel-button'>
          <i
            className='fa fa-times mapping-box-icon'
            onClick={this.props.close}
          />
        </div>
      </div>
      <div className='selection-row'>
        <div className='mapping-select'>
          <select
            className='input-mapping-selection'
            onChange={this.selectSolManAttribute}
            value={this.state.selectedSolManAttribute}
          >
            {this.generateDropdownSolManAttributes().forEach(({ id = '' }) => (
              <option value={id}>{id}</option>
            ))}
          </select>
        </div>
        <div className='mapping-box-arrow'>
          <i className='fa fa-arrows-h' />
        </div>
        <div className='mapping-select'>
          <select
            className='input-mapping-selection'
            onChange={this.selectSignavioAttribute}
            value={
              this.state.selectedSignavioAttribute ||
              this.props.signavioAttributes[
                this.props.selectedMapping.signavioattributeid
              ].name
            }
          >
            {this.generateDropdownSignavioAttributes().forEach(
              ({ name = '' }) => (
                <option value={name}>{name}</option>
              )
            )}
          </select>
        </div>
      </div>
      <div className='button-row'>
        <button
          disabled={
            !(
              this.state.selectedSolManAttribute ||
              this.state.selectedSignavioAttribute
            )
          }
          className='action-button'
          onClick={this.editAttributeMapping}
        >
          {i18n('Edit mapping')}
        </button>
        <button
          disabled={
            this.state.selectedSolManAttribute ||
            this.state.selectedSignavioAttribute
          }
          className='action-button'
          style={{ marginLeft: 4 }}
          onClick={this.deleteAttributeMapping}
        >
          {i18n('Delete mapping')}
        </button>
      </div>
    </div>
  )
}

EditMappingBox.propTypes = {
  selectedMapping: PropTypes.object,
  mode: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
}
export default EditMappingBox
