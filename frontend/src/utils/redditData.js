export const REDDIT_POSTS = {
  hdb_mop_extension: {
    post_id: "16ls1e0",
    title: "Many S'poreans support longer minimum occupation period for BTO flats: Desmond Lee",
    url: "https://www.reddit.com/r/singapore/comments/16ls1e0",
    policy_question_id: "hdb_mop_extension",
    subreddit: "r/singapore"
  },
  pwm_expansion: {
    post_id: "1as8vh7",
    title: "Budget 2024: Firms hiring foreigners must pay locals minimum S$1,600 wage, up from S$1,400",
    url: "https://www.reddit.com/r/singapore/comments/1as8vh7",
    policy_question_id: "pwm_expansion",
    subreddit: "r/singapore"
  },
  foreign_worker_levy: {
    post_id: "1j4tk8l",
    title: "Work permit holders can stay employed in S'pore for longer as MOM tweaks foreign worker rules",
    url: "https://www.reddit.com/r/singapore/comments/1j4tk8l",
    policy_question_id: "foreign_worker_levy",
    subreddit: "r/singapore"
  }
};

export async function fetchRedditComments(post_id) {
  try {
    const redditURL = `https://www.reddit.com/r/singapore/comments/${post_id}.json?limit=50&sort=top`;
    const res = await fetch('https://singapore-sim-proxy.sikka-arshin.workers.dev', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Reddit-URL': redditURL
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const children = data[1]?.data?.children || [];
    return children
      .map(c => c.data)
      .filter(d =>
        d.body &&
        d.body !== '[deleted]' &&
        d.body !== '[removed]' &&
        d.author !== 'AutoModerator'
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map(d => ({ author: d.author, body: d.body, score: d.score }));
  } catch (_) {
    return [];
  }
}

export async function classifyRedditComments(comments, questionTitle, apiKey) {
  if (!comments.length) return [];

  const commentsList = comments
    .map((c, i) => `${i}: ${c.body.replace(/\n+/g, ' ').slice(0, 400)}`)
    .join('\n');

  const prompt =
    `You are analysing Reddit comments about this Singapore policy question: "${questionTitle}"\n\n` +
    `Classify each comment below as Support, Oppose, or Neutral toward the policy.\n` +
    `Also extract the key concern in 10 words or less.\n\n` +
    `Return ONLY a JSON array with one object per comment in this exact format:\n` +
    `[{"index": 0, "position": "Support", "key_concern": "..."}, ...]\n\n` +
    `Comments to classify:\n` +
    commentsList;

  try {
    const res = await fetch('https://singapore-sim-proxy.sikka-arshin.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_completion_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const content = raw.choices?.[0]?.message?.content || '';

    let classifications;
    try {
      classifications = JSON.parse(content);
    } catch (_) {
      const cleaned = content.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
      try {
        classifications = JSON.parse(cleaned);
      } catch (_) {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) classifications = JSON.parse(match[0]);
        else throw new Error('Unparseable classification response');
      }
    }

    return comments.map((c, i) => {
      const cls = classifications.find(x => x.index === i);
      const pos = cls?.position;
      return {
        ...c,
        position: ['Support', 'Oppose', 'Neutral'].includes(pos) ? pos : 'Neutral',
        key_concern: cls?.key_concern || '',
      };
    });
  } catch (_) {
    return comments.map(c => ({ ...c, position: 'Neutral', key_concern: '' }));
  }
}
