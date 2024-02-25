// import React, { Component, ChangeEvent } from "react";


// interface DraftProps {
//   /** Initial state of the file. */
//   drafter: string;
//   rounds: number;
//   options: Array<string>;
//   drafters: Array<string>;
//   id: number;
//   onSave: () => void;
//   onBack: () => void;
// }


// interface DraftState {
//   /** The list of options left to choose room */
//   leftOptions: Array<string>;

// }


// export class Draft extends Component<DraftProps, DraftState> {

//   constructor(props: any) {
//     super(props);

//     this.state = {
//         leftOptions: props.options,
//     };
//   }

//   render = (): JSX.Element => {
//     // continue picking for the props number of rounds
//     for (let i = 0; i < this.props.rounds; i++) {
//       // each round consists of a pick from each drafter
//         for (const drafter of this.props.drafters) {
//             if (drafter === this.props.drafter) {
//                 // make a draft pick
//                 const files: JSX.Element[] = [];
//                 for (const option of this.props.options) {
//                     files.push(
//                         <li>
//                           <a>
//                             <option value="option">{option}</option>
//                           </a>
//                         </li>
//                     );
//                     return (
//                         <div>
//                             <h2>Status of Draft "{this.props.id}"</h2>
//                             // list
//                             <p>It's your pick!</p>
//                             <select onChange={this.handleOptionChange}>
//                                 <option value="white">{this.props.options[j]}</option>
//                             </select>
//                         </div>
//                     )
//                 }
//             } else {
//                 // see draft status
//                 return (
//                     <div>
//                         <h2>Status of Draft "{this.props.id}"</h2>
//                         // list
//                         <p>Waiting for James to pick.</p>
//                     </div>
//                 );
//             }
//         }
//     }
//     // show complete draft
//   }
// }