import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    Table, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';

const url = "https://jsonplaceholder.typicode.com/albums";

class Tabela extends React.Component {

    state={
        data: [],
        ModalInserir: false,
        ModalEliminar: false,
        form: {
            id: '',
            title: '',
            tipoModal: ''
        }
    }

   ApiGet =()=> {
       axios.get(url).then(response=>{
           this.setState({data: response.data})
       }).catch(error=>{
            console.log(error.message);
       })
   }

   ApiPost=async ()=>{
       delete this.state.form.id;
       await axios.post(url,this.state.form).then(response=>{
        this.ModalInserir();
        this.ApiGet();
       }).catch(error=>{
            console.log(error.message);
       })
   }

   ApiPut =()=> {
       axios.put(url+this.state.form.id, this.state.form).then(rensponse=>{
        this.ModalInserir();
        this.ApiGet();
       })
   }

   ApiUpdate = (dados) => {
       this.setState({
           tipoModal: 'atualizar',
           form: {
               id: dados.id,
               title: dados.title
           }
       })
   }

   ApiDelete = () =>{
    axios.delete(url+this.state.form.id).then(response=>{
        this.setState({ModalEliminar: false});
        this.ApiGet();
    })
   }


   ModalInserir =()=>{
       this.setState({ModalInserir: !this.state.ModalInserir})
   }

   ModalEliminar =()=> {
       this.setState({ModalEliminar: !this.state.ModalEliminar})
   }

   handleChange=async e=> {
   e.persist();
   await this.setState({
       form:{
           ...this.state.form,
           [e.target.id]: [e.target.value]
       }
   });

   console.log(this.state.form);

   }

    componentDidMount(){
        this.ApiGet();
    }

    render() {
        const {form} = this.state;
        return (
            <div className="Tabela">
                <button className="btn btn-success" onClick={()=> {this.setState({form: null, tipoModal: 'inserir'}); this.ModalInserir()}}>Adicionar</button>
                <br /><br />
                <Table className="table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id</th>
                            <th>Titulo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.data.map(dados=>{
                    return(
                    <tr>
                        <td>{dados.id}</td>
                        <td>{dados.title}</td>
                        <td>
                        <button className="btn btn-info" onClick={()=>{this.ApiUpdate(dados); this.ModalInserir()}}>Editar</button>
                        {"   "}
                         <button className="btn btn-danger" onClick={()=>{this.ApiUpdate(dados); this.setState({ModalEliminar: true})}}>Excluir</button>
                        </td>
                    </tr>
                           )
                    })}
                    </tbody>
                </Table>


            {/* Modal Inserir */}

            <Modal isOpen={this.state.ModalInserir}>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="title">Titulo</label>
                    <input className="form-control" type="text" name="title" id="title" onChange={this.handleChange} value={form?form.title: ''}/>
                    <br />
                  </div>
                </ModalBody>
                <ModalFooter>
                    {this.state.tipoModal  == 'inserir'?
                    <button className="btn btn-primary" onClick={()=>this.ApiPost()}>
                    Inserir
                  </button>:
                  <button className="btn btn-primary" onClick={()=>this.ApiPut()}>
                    Atualizar
                  </button>
    }
                    <button className="btn btn-danger" onClick={()=> this.ModalInserir()}>Cancelar</button>
                </ModalFooter>
                </Modal>

                {/* Modal Eliminar*/}

                <Modal isOpen={this.state.ModalEliminar}>
                    <ModalBody>
                        Eliminar?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=> this.ApiDelete()}>Eliminar</button>
                        <button className="btn btn-info" onClick={()=>this.ModalEliminar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default Tabela;