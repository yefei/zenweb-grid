import { create } from 'zenweb';
import modForm, { formTemplate } from '@zenweb/form';
import modMySQL from '@zenweb/mysql';
import modCors from '@zenweb/cors';
import template from '@zenweb/template';
import nunjucks from '@zenweb/template-nunjucks';
import modGrid, { gridTemplate } from '../src';
import { bindQuery } from './model';

create({
  controller: {
    discoverPaths: ['./controller']
  }
})
.setup(modCors({ origin: '*' }))
.setup(modForm())
.setup(modGrid())
.setup(modMySQL({
  bindQuery,
  pools: {
    MASTER: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'test',
      charset: 'utf8mb4',
      timezone: '+08:00',
      connectionLimit: 100,
    },
  }
}))
.setup(template({
  templateAffix: '.njk',
  failTemplate: 'fail.html.njk',
  engine: nunjucks({
    path: [
      './template',
      formTemplate,
      gridTemplate,
    ],
    nunjucksConfig: {
      noCache: true,
    }
  }),
}))
.start();
