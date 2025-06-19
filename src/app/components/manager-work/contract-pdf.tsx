'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 1.6,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

interface Contract {
  id: string;
  service: string;
  term: string;
  deposit: number;
  interactionPeriod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ContractPDF: React.FC<{ contract: Contract }> = ({ contract }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>ДОГОВІР № {contract.id}</Text>

      <Text style={styles.paragraph}>
        Цей договір укладено між Виконавцем та Замовником про надання послуги{' '}
        <Text style={styles.bold}>{contract.service}</Text>. Сторони домовилися про термін
        виконання робіт — <Text style={styles.bold}>{contract.term}</Text>, що є невід’ємною
        умовою цього договору.
      </Text>

      <Text style={styles.paragraph}>
        Замовник зобов’язується внести авансовий платіж у розмірі{' '}
        <Text style={styles.bold}>{contract.deposit} грн</Text> до початку виконання послуги.
        Строк співпраці визначено як{' '}
        <Text style={styles.bold}>{contract.interactionPeriod}</Text>.
      </Text>

      <Text style={styles.paragraph}>
        Цей договір набирає чинності з моменту підписання обома сторонами та є чинним до
        повного виконання зобов’язань.
      </Text>

      <Text style={styles.paragraph}>
        Дата створення договору:{' '}
        <Text style={styles.bold}>
          {contract.createdAt?.toLocaleDateString('uk-UA') || '—'}
        </Text>
        .
      </Text>

      <Text style={styles.paragraph}>
        Дата останнього оновлення:{' '}
        <Text style={styles.bold}>
          {contract.updatedAt?.toLocaleDateString('uk-UA') || '—'}
        </Text>
        .
      </Text>

      <View style={styles.signatureSection}>
        <Text>___________________</Text>
        <Text>___________________</Text>
      </View>
      <View style={styles.signatureSection}>
        <Text>Замовник</Text>
        <Text>Виконавець</Text>
      </View>
    </Page>
  </Document>
);
