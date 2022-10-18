import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const CommandList = [
  {
    command: 'ad',
    alias: 'aad',
    description: 'Azure Active Directory',
    category: 'Azure Active Directory',
    url: ''
  },
  {
    command: 'adadfslog',
    alias: '',
    description: 'ADFS services',
    category: 'Azure Active Directory',
    url: ''
  },
  {
    command: 'adappreg',
    alias: '',
    description: 'App registrations',
    category: 'Azure Active Directory',
    url: ''
  },
  {
    command: 'adapps',
    alias: 'adapp,adentapp',
    description: 'Enterprise applications',
    category: 'Azure Active Directory',
    url: ''
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
