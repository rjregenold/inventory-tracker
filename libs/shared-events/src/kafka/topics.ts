import {Kafka} from 'kafkajs';

export const TOPICS = {
  PROCUREMENT: 'procurement',
  INVENTORY: 'inventory',
  AUTH: 'auth',
} as const;

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

function daysAsMillis(days: number): number {
  return days * MILLIS_PER_DAY;
}

export const TOPIC_CONFIGS = {
  [TOPICS.PROCUREMENT]: {
    numPartitions: 10,
    configEntries: [
      {name: 'retention.ms', value: `${daysAsMillis(30)}`},
      {name: 'cleanup.policy', value: 'delete'},
    ],
  },
  [TOPICS.INVENTORY]: {
    numPartitions: 20,
    configEntries: [
      {name: 'retention.ms', value: `${daysAsMillis(30)}`},
      {name: 'cleanup.policy', value: 'delete'},
    ],
  },
  [TOPICS.AUTH]: {
    numPartitions: 10,
    configEntries: [
      {name: 'retention.ms', value: `${daysAsMillis(7)}`},
      {name: 'cleanup.policy', value: 'delete'},
    ],
  },
};

export async function ensureTopicsExist(kafka: Kafka) {
  const admin = kafka.admin();

  try {
    await admin.connect();

    const existingTopics = await admin.listTopics();
    const topicsToCreate = Object.entries(TOPIC_CONFIGS)
      .filter(([topic]) => !existingTopics.includes(topic))
      .map(([topic, config]) => ({
        topic,
        ...config,
      }));

    if (topicsToCreate.length > 0) {
      await admin.createTopics({topics: topicsToCreate});
      console.log(
        `Created topics: ${topicsToCreate.map((t) => t.topic).join(', ')}`,
      );
    }
  } finally {
    await admin.disconnect();
  }
}
