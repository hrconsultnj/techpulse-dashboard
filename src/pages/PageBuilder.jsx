import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function PageBuilder() {
  const [components, setComponents] = useState([
    { id: 'header', type: 'header', content: 'Welcome to Your Page' },
    { id: 'text', type: 'text', content: 'This is a sample text component.' },
    { id: 'button', type: 'button', content: 'Click Me' },
  ]);

  const [availableComponents] = useState([
    { id: 'new-header', type: 'header', content: 'New Header' },
    { id: 'new-text', type: 'text', content: 'New Text Block' },
    { id: 'new-button', type: 'button', content: 'New Button' },
    { id: 'new-image', type: 'image', content: 'Image Placeholder' },
    { id: 'new-card', type: 'card', content: 'Card Component' },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const addComponent = (component) => {
    const newComponent = {
      ...component,
      id: `${component.type}-${Date.now()}`,
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const renderComponent = (component, index) => {
    const baseClasses = "component-preview";
    
    switch (component.type) {
      case 'header':
        return (
          <div className={`${baseClasses} header-component`}>
            <h1 className="text-xl font-bold">{component.content}</h1>
            <button 
              className="remove-btn"
              onClick={() => removeComponent(component.id)}
            >
              ×
            </button>
          </div>
        );
      case 'text':
        return (
          <div className={`${baseClasses} text-component`}>
            <p className="text-base">{component.content}</p>
            <button 
              className="remove-btn"
              onClick={() => removeComponent(component.id)}
            >
              ×
            </button>
          </div>
        );
      case 'button':
        return (
          <div className={`${baseClasses} button-component`}>
            <button className="btn btn-primary">{component.content}</button>
            <button 
              className="remove-btn"
              onClick={() => removeComponent(component.id)}
            >
              ×
            </button>
          </div>
        );
      case 'image':
        return (
          <div className={`${baseClasses} image-component`}>
            <div className="image-placeholder">
              <span>🖼️ Image</span>
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeComponent(component.id)}
            >
              ×
            </button>
          </div>
        );
      case 'card':
        return (
          <div className={`${baseClasses} card-component`}>
            <div className="card shadow-md rounded-2xl p-4">
              <h3 className="text-lg font-semibold">Card Title</h3>
              <p className="text-base">Card content goes here</p>
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeComponent(component.id)}
            >
              ×
            </button>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} default-component`}>
            <p>{component.content}</p>
            <button 
              className="remove-btn"
              onClick={() => removeComponent(component.id)}
            >
              ×
            </button>
          </div>
        );
    }
  };

  return (
    <div className="page-builder">
      <div className="page-builder-header">
        <h1 className="text-xl font-bold">Page Builder</h1>
        <p className="text-base text-gray-600">Drag and drop components to build your page</p>
      </div>

      <div className="page-builder-content">
        <div className="components-sidebar">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <div className="available-components">
            {availableComponents.map((component) => (
              <div
                key={component.id}
                className="component-item"
                onClick={() => addComponent(component)}
              >
                <div className="component-icon">
                  {component.type === 'header' && '📰'}
                  {component.type === 'text' && '📝'}
                  {component.type === 'button' && '🔘'}
                  {component.type === 'image' && '🖼️'}
                  {component.type === 'card' && '🃏'}
                </div>
                <span className="component-name">{component.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="page-canvas">
          <div className="canvas-header">
            <h2 className="text-lg font-semibold">Page Preview</h2>
            <div className="canvas-actions">
              <button className="btn btn-secondary">Preview</button>
              <button className="btn btn-primary">Save Page</button>
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="page-components">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="canvas-area"
                >
                  {components.map((component, index) => (
                    <Draggable
                      key={component.id}
                      draggableId={component.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-component"
                        >
                          {renderComponent(component, index)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {components.length === 0 && (
                    <div className="empty-canvas">
                      <p className="text-base text-gray-500">
                        Start building your page by adding components from the sidebar
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default PageBuilder;