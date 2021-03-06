import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';
import Navbar from './Navbar'

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
        .then(response => response.json())
        .then(json => this.setState({ blocks: json }));
    }

    render() {
        console.log('this.state', this.state);

        return (
            <div>
                <Navbar />
                <div className="empty mt-2">
                <h3>Blocks</h3>
                {
                    this.state.blocks.map(block => {//for each block item
                        return (  
                            <Block key={block.hash} block={block} />//render according to instructions in the Block.js file
                        );
                    })
                }
            </div>
            </div>
        );
    }
}

export default Blocks;