import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Glosario from './components/Glosario';
import { IGlosarioProps } from './components/IGlosarioProps';

export default class GlosarioWebPart extends BaseClientSideWebPart<IGlosarioProps> {
  public render(): void {
    const element: React.ReactElement<IGlosarioProps> = React.createElement(Glosario, {
      itemsPerPage: this.properties.itemsPerPage || 20,
      context: this.context
    });

    ReactDom.render(element, this.domElement);
  }

  protected getPropertyPaneConfiguration() {
    return {
      pages: [
        {
          header: { description: "Configuración del Glosario" },
          groups: [
            {
              groupName: "Opciones",
              groupFields: [
                PropertyPaneSlider('itemsPerPage', {
                  label: "Términos por página",
                  min: 5,
                  max: 50,
                  step: 5,
                  value: 20
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
