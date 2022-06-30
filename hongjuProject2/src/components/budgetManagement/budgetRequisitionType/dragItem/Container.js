import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@DragDropContext(HTML5Backend)
class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: []
    };
  }
  componentWillMount() {

    let headerDimensionRefs = this.props.budgetClass.headerDimensionRefs;
    this.setState({
      cards: headerDimensionRefs ? headerDimensionRefs : []
    });
  }
  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }));
  }

  render() {
    const { cards } = this.state;

    return (
      <div >
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            item={card}
            moveCard={this.moveCard}
            editHtmlType={this.props.editHtmlType}
          />
        ))}
      </div>
    );
  }
}


function mapStateToProps($$state) {
  let state = $$state.get('budgetRequisitionTypeState');
  let budgetClass = state.get('budgetClass').toJS();
  let editHtmlType = state.get('editHtmlType');
  return {
    budgetClass,
    editHtmlType
  }
}

function mapDispatchToProps(dispatch) {
  let methods = {
  };
  let boundActionCreators = bindActionCreators(methods, dispatch);
  return {
    dispatch,
    ...boundActionCreators
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
