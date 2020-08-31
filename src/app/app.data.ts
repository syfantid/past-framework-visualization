import { PeriodicTable } from './app.model';

export let periodicTable = new PeriodicTable();

// Add data.
periodicTable.addColumn('Primary Task Support')
  .add('Sm', 'Self-monitoring', 5)
  .add('Pe', 'Personalization', 4)
  .add('Rd', 'Reduction', 3)
  .add('Ta', 'Tailoring', 2)
  .add('Tu', 'Tunneling', 2)
  .add('Su', 'Simulation', 2)
  .add('Rh', 'Rehearsed', 1);

periodicTable.addColumn('Dialogue')
  .add('Re', 'Rewards', 4)
  .add('Su', 'Suggestion', 3)
  .add('Rm', 'Reminders', 3)
  .add('Si', 'Similarity', 3)
  .add('Pr', 'Praise', 3)
  .add('Li', 'Liking', 2)
  .add('Sr', 'Social Role', 2);

periodicTable.addColumn('Social Support')
  .add('Sc', 'Social Comparison', 3)
  .add('Sl', 'Social Learning', 3)
  .add('Co', 'Cooperation', 3)
  .add('Cm', 'Competition', 2)
  .add('Rc', 'Recognition', 2)
  .add('Sf', 'Social Facilitation', 2)
  .add('Ni', 'Normative Influence', 2);

periodicTable.addColumn('System Credibility')
  .add('Au', 'Authority', 2)
  .add('Sr', 'Surface Credibility', 2)
  .add('Ex', 'Expertise', 2)
  .add('Tr', 'Trustworthiness', 1)
  .add('Rf', 'Real-world Feel', 1);

periodicTable.addColumn('Other')
  .add('Gs', 'Goal-setting', 5)
  .add('Pu', 'Punishment', 2)
  .add('Gi', 'General Information', 1)
  .add('Va', 'Variability', 1);
