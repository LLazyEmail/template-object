interface FactorySettings {
  component: (params: any, subcomponents?: any) => any;
  params: Record<string, any>;
  subcomponents?: any;
}

class factoryFour2 {
//     constructor(component, params) {
        
//         this.component = component;
//         this.params = params;
//     }

//     create = (settings) => {
//         const { component, params } = settings;



//     }
}

// I want factory to return an object that can be changable.

function factoryFour(settings: FactorySettings){


    const { component, params, subcomponents } = settings;


    return  {

        params,
        // plateNO,
        changeParams(value: Partial<typeof params>){
            this.params = Object.assign(this.params, value);
        },
        start () {

            console.log(this.params)
        },
        display () {
            return component(params, subcomponents);

            // console.log("driving car...")
        }
    }

}

export { factoryFour, factoryFour2 };
