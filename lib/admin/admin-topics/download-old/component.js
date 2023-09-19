import React, { Component } from 'react'
import NanoModal from 'nanomodal'
import topicStore from 'lib/stores/topic-store/topic-store'

let modalRef

export default class DownloadOlds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'todos',
            years: [],
            sort: 'newest',
            yearsDeleteds: []
        }
    }

    componentDidMount() {
        this.createModal()
        topicStore.findYearsDeletedProyectos(`?forum=${this.props.forum.id}`)
            .then(res => this.setState({ yearsDeleteds: res.results }))
    }


    onButtonPressed() {
        let query = {
            forum: this.props.forum.id,
            type: this.state.type,
            years: this.state.years,
            sort: this.state.sort,
        }
        let queryString = Object.keys(query)
            .filter((k) => query[k] && query[k].length > 0)
            .map((k) => `${k}=${Array.isArray(query[k]) ? query[k].join(',') : query[k]}`)
            .join('&')

        window.fetch(`/api/v2/export/old-topics?${queryString}`, { credentials: 'include' })
            .then(response => response.blob())
            .then(blob => {
                // Crear un enlace para descargar el archivo
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'topics-borrados.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(error => {
                console.log('Error al descargar el archivo XLS:', error);
            });

    }

    createModal() {
        modalRef = NanoModal(document.getElementById('modalDownload'),
            {
                classes: 'modalContentDonloads',
                buttons: [{
                    text: "Descargar",
                    handler: (modal) => {
                        // do something...
                        this.onButtonPressed()
                        //modal.hide();
                    },
                    classes: 'btn btn-primary',
                }, {
                    text: "Cancelar",
                    classes: 'btn btn-secondary',
                    handler: "hide"
                }],

            })


        modalRef.customShow = function (defaultShow, modalAPI) {
            modalAPI.overlay.el.style.position = 'fixed'
            modalAPI.overlay.el.style.display = 'block';
            modalAPI.modal.el.style.display = 'block';
        };

    }

    onDownloadOldClick() {
        modalRef.customShow(modalRef.show, modalRef);

    }

    onChangeSelect(event) {

        let typeField = event.target.dataset.type
        let value = event.target.value

        if (typeField === 'years') {
            var result = [];
            var options = event.target && event.target.options;
            var opt;

            for (var i = 0, iLen = options.length; i < iLen; i++) {
                opt = options[i];

                if (opt.selected) {
                    result.push(opt.value || opt.text);
                }
            }
            value = result

        }

        this.setState({
            [typeField]: value
        })


    }

    render() {
        let { yearsDeleteds } = this.state
        return (
            <div className='modalDownload'>
                <button className='btn btn-primary btn-sm download-old-topics' onClick={this.onDownloadOldClick}>  descargar proyectos antiguos</button>

                <div id='modalDownload'>
                    {/*  <p>hola soy n modal</p>
                    {this.state.type}
                    {this.state.years}
                    {this.state.sort} */}
                    <div className="row">
                        <div className="col-md-6">
                            <div>

                                <label >Tipo</label>
                                <select onChange={(e) => this.onChangeSelect(e)} data-type='type' id='selectType' className="form-control">
                                    <option value='todos'>Todos</option>
                                    <option value='proyecto'>Proyectos</option>
                                    <option value='pendiente'>Ideas</option>
                                </select>


                            </div>
                            <div>
                                <label>Años</label>
                                <select multiple id='selectYears' onChange={(e) => this.onChangeSelect(e)} data-type='years' className="form-control">

                                    {yearsDeleteds.map(year => <option value={year} key={year}>{year}</option>)}
                                </select>



                            </div>
                        </div>
                        <div className="col-md-6">
                            <div>
                                <label>ordenar por</label>
                                <select id='selectSort' onChange={(e) => this.onChangeSelect(e)} data-type='sort' className="form-control">
                                    <option value='newest'>Años - mas nuevo </option>
                                    <option value='latest'>Años - mas antiguos</option>
                                    <option value='voted'>Mas votados</option>
                                </select>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )
    }

}