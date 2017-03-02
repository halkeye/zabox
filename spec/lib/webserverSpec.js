/* globals require: false, describe: false, beforeEach: false, it: false, expect: false */
var request = require('supertest');

var path = require('path');
var WebServer = require(path.join(__dirname, '/../../lib/webserver'));
var Storage = require(path.join(__dirname, '/../../lib/storage/test'));

var responses = {
  '/api': ['json'],
  '/api/json': ['messages', 'smtp_settings'],
  '/api/json/messages': [
    { id: 'b5c89620-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'HTML and Plain text message', to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ], timestamp: '2007-03-01T13:00:00Z' },
    { id: 'b5c8999-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'Plain text only', to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ], timestamp: '2012-03-01T13:00:00Z' },
    { id: 'b5c8992543-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'HTML only', to: [ 'Sean Everest <sean.b.everest@gmail.com>' ], timestamp: '2014-11-01T13:00:00Z' }
  ],
  '/api/json/smtp_settings': { messageLimit: 100, hostname: '127.0.0.1', port: 1 },
  '/api/json/messages/b5c89620-665f-42b5-a431-42327d3bff6a': { id: 'b5c89620-665f-42b5-a431-42327d3bff6a',
    from: 'Gavin Mogan <gavin@gavinmogan.com>',
    timestamp: '2007-03-01T13:00:00Z',
    to:
    [ 'Gavin Mogan <gavin@gavinmogan.com>',
      'Sean Everest <sean.b.everest@gmail.com>' ],
    cc: [ 'CC <cc@test.net>' ],
    bcc: [ 'Blank Copy <bc@test.net>' ],
    subject: 'HTML and Plain text message',
    body:
    { plain: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quae autem natura suae primae institutionis oblita est? Id mihi magnum videtur. Num quid tale Democritus? Tecum optime, deinde etiam cum mediocri amico. Duo Reges: constructio interrete. \n\nHaec bene dicuntur, nec ego repugno, sed inter sese ipsa pugnant. Ita multo sanguine profuso in laetitia et in victoria est mortuus. Verum esto: verbum ipsum voluptatis non habet dignitatem, nec nos fortasse intellegimus. Negat esse eam, inquit, propter se expetendam. Non autem hoc: igitur ne illud quidem. Sed in rebus apertissimis nimium longi sumus. Qua tu etiam inprudens utebare non numquam. Nosti, credo, illud: Nemo pius est, qui pietatem-; \n\nQuod quidem iam fit etiam in Academia. Cupiditates non Epicuri divisione finiebat, sed sua satietate. Non autem hoc: igitur ne illud quidem. Disserendi artem nullam habuit. Placet igitur tibi, Cato, cum res sumpseris non concessas, ex illis efficere, quod velis? Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? In eo enim positum est id, quod dicimus esse expetendum. Quis istum dolorem timet? \n\nSed fortuna fortis; Vide igitur ne non debeas verbis nostris uti, sententiis tuis. Quid ergo hoc loco intellegit honestum? Polemoni et iam ante Aristoteli ea prima visa sunt, quae paulo ante dixi. Cum sciret confestim esse moriendum eamque mortem ardentiore studio peteret, quam Epicurus voluptatem petendam putat. Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Non enim, si omnia non sequebatur, idcirco non erat ortus illinc. Sed ego in hoc resisto; Quid dubitas igitur mutare principia naturae? \n\nSic, et quidem diligentius saepiusque ista loquemur inter nos agemusque communiter. Etsi ea quidem, quae adhuc dixisti, quamvis ad aetatem recte isto modo dicerentur. Laelius clamores sofòw ille so lebat Edere compellans gumias ex ordine nostros. At quicum ioca seria, ut dicitur, quicum arcana, quicum occulta omnia? \n\n',
      html: '<!DOCTYPE html> <html> <body> <h1>Hic nihil fuit, quod quaereremus.</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <code>Paria sunt igitur.</code> Duo Reges: constructio interrete. Itaque contra est, ac dicitis; Cuius quidem, quoniam Stoicus fuit, sententia condemnata mihi videtur esse inanitas ista verborum. De illis, cum volemus. Quaero igitur, quo modo hae tantae commendationes a natura profectae subito a sapientia relictae sint. Summum a vobis bonum voluptas dicitur. Verba tu fingas et ea dicas, quae non sentias? Quippe: habes enim a rhetoribus; Hoc ne statuam quidem dicturam pater aiebat, si loqui posset. Nec enim, omnes avaritias si aeque avaritias esse dixerimus, sequetur ut etiam aequas esse dicamus. Quae duo sunt, unum facit. </p><h3>In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret.</h3><p>Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. Esse enim quam vellet iniquus iustus poterat inpune. Sic enim censent, oportunitatis esse beate vivere. Quid de Platone aut de Democrito loquar? Esse enim quam vellet iniquus iustus poterat inpune. </p><h2>Nunc vides, quid faciat.</h2><p>Illa sunt similia: hebes acies est cuipiam oculorum, corpore alius senescit; Quid adiuvas? Sed quanta sit alias, nunc tantum possitne esse tanta. Tubulum fuisse, qua illum, cuius is condemnatus est rogatione, P. <code>Haeret in salebra.</code> Non igitur bene. </p><p>Vide igitur ne non debeas verbis nostris uti, sententiis tuis. Vide, quantum, inquam, fallare, Torquate. Heri, inquam, ludis commissis ex urbe profectus veni ad vesperum. <code>Restinguet citius, si ardentem acceperit.</code> Cyrenaici quidem non recusant; </p><ol>\t<li>Dici enim nihil potest verius.</li>\t<li>Videamus animi partes, quarum est conspectus illustrior;</li>\t<li>Uterque enim summo bono fruitur, id est voluptate.</li>\t<li>Sin tantum modo ad indicia veteris memoriae cognoscenda, curiosorum.</li></ol><blockquote cite=\'http://loripsum.net\'>\tSi stante, hoc natura videlicet vult, salvam esse se, quod concedimus;</blockquote><p>Sed quid attinet de rebus tam apertis plura requirere? Tum Torquatus: Prorsus, inquit, assentior; Compensabatur, inquit, cum summis doloribus laetitia. Non ego tecum iam ita iocabor, ut isdem his de rebus, cum L. Tu enim ista lenius, hic Stoicorum more nos vexat. Cur fortior sit, si illud, quod tute concedis, asperum et vix ferendum putabit? </p><ul>\t<li>Quam ob rem tandem, inquit, non satisfacit?</li>\t<li>Sapiens autem semper beatus est et est aliquando in dolore;</li>\t<li>Quod si ita se habeat, non possit beatam praestare vitam sapientia.</li>\t<li>Est autem a te semper dictum nec gaudere quemquam nisi propter corpus nec dolere.</li></ul><pre>Nam Pyrrho, Aristo, Erillus iam diu abiecti.Cum ageremus, inquit, vitae beatum et eundem supremum diem,scribebamus haec.</pre><dl>\t<dt><dfn>Stoicos roga.</dfn></dt>\t<dd>Beatus autem esse in maximarum rerum timore nemo potest.</dd>\t<dt><dfn>Quonam modo?</dfn></dt>\t<dd>Scio enim esse quosdam, qui quavis lingua philosophari possint;</dd></dl> </body> </html>' },
    raw: [ 'Date: Fri, 15 May 2015 20:27:00 -0700 (PDT)\nFrom: gavin@gavinmogan.com\nTo: sean.b.everest@gmail.com\nMessage-ID: <1160493024.01431746820495.JavaMail.jos@jojos.local>\nSubject: HTML and Plain text message\nMIME-Version: 1.0\nContent-Type: multipart/mixed; \n\tboundary="----=_Part_0_1199604121.1431746820297"\nX-Mailer: mailer program\n\n------=_Part_0_1199604121.1431746820297\nContent-Type: text/plain; charset=MacRoman\nContent-Transfer-Encoding: quoted-printable\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quae autem natura =\nsuae primae institutionis oblita est? Id mihi magnum videtur. Num quid tale=\n Democritus? Tecum optime, deinde etiam cum mediocri amico. Duo Reges: cons=\ntructio interrete.=20\n\nHaec bene dicuntur, nec ego repugno, sed inter sese ipsa pugnant. Ita multo=\n sanguine profuso in laetitia et in victoria est mortuus. Verum esto: verbu=\nm ipsum voluptatis non habet dignitatem, nec nos fortasse intellegimus. Neg=\nat esse eam, inquit, propter se expetendam. Non autem hoc: igitur ne illud =\nquidem. Sed in rebus apertissimis nimium longi sumus. Qua tu etiam inpruden=\ns utebare non numquam. Nosti, credo, illud: Nemo pius est, qui pietatem-;=\n=20\n\nQuod quidem iam fit etiam in Academia. Cupiditates non Epicuri divisione fi=\nniebat, sed sua satietate. Non autem hoc: igitur ne illud quidem. Disserend=\ni artem nullam habuit. Placet igitur tibi, Cato, cum res sumpseris non conc=\nessas, ex illis efficere, quod velis? Sed nonne merninisti licere mihi ista=\n probare, quae sunt a te dicta? In eo enim positum est id, quod dicimus ess=\ne expetendum. Quis istum dolorem timet?=20\n\nSed fortuna fortis; Vide igitur ne non debeas verbis nostris uti, sententii=\ns tuis. Quid ergo hoc loco intellegit honestum? Polemoni et iam ante Aristo=\nteli ea prima visa sunt, quae paulo ante dixi. Cum sciret confestim esse mo=\nriendum eamque mortem ardentiore studio peteret, quam Epicurus voluptatem p=\netendam putat. Nec lapathi suavitatem acupenseri Galloni Laelius anteponeba=\nt, sed suavitatem ipsam neglegebat; Non enim, si omnia non sequebatur, idci=\nrco non erat ortus illinc. Sed ego in hoc resisto; Quid dubitas igitur muta=\nre principia naturae?=20\n\nSic, et quidem diligentius saepiusque ista loquemur inter nos agemusque com=\nmuniter. Etsi ea quidem, quae adhuc dixisti, quamvis ad aetatem recte isto =\nmodo dicerentur. Laelius clamores sof=98w ille so lebat Edere compellans gu=\nmias ex ordine nostros. At quicum ioca seria, ut dicitur, quicum arcana, qu=\nicum occulta omnia?=20\n\n\n------=_Part_0_1199604121.1431746820297\nContent-Type: text/html; charset=MacRoman\nContent-Transfer-Encoding: quoted-printable\n\n<h1>Hic nihil fuit, quod quaereremus.</h1><p>Lorem ipsum dolor sit amet, co=\nnsectetur adipiscing elit. <code>Paria sunt igitur.</code> Duo Reges: const=\nructio interrete. Itaque contra est, ac dicitis; Cuius quidem, quoniam Stoi=\ncus fuit, sententia condemnata mihi videtur esse inanitas ista verborum. De=\n illis, cum volemus. Quaero igitur, quo modo hae tantae commendationes a na=\ntura profectae subito a sapientia relictae sint. Summum a vobis bonum volup=\ntas dicitur. Verba tu fingas et ea dicas, quae non sentias? Quippe: habes e=\nnim a rhetoribus; Hoc ne statuam quidem dicturam pater aiebat, si loqui pos=\nset. Nec enim, omnes avaritias si aeque avaritias esse dixerimus, sequetur =\nut etiam aequas esse dicamus. Quae duo sunt, unum facit. </p><h3>In his igi=\ntur partibus duabus nihil erat, quod Zeno commutare gestiret.</h3><p>Iis ig=\nitur est difficilius satis facere, qui se Latina scripta dicunt contemnere.=\n Esse enim quam vellet iniquus iustus poterat inpune. Sic enim censent, opo=\nrtunitatis esse beate vivere. Quid de Platone aut de Democrito loquar? Esse=\n enim quam vellet iniquus iustus poterat inpune. </p><h2>Nunc vides, quid f=\naciat.</h2><p>Illa sunt similia: hebes acies est cuipiam oculorum, corpore =\nalius senescit; Quid adiuvas? Sed quanta sit alias, nunc tantum possitne es=\nse tanta. Tubulum fuisse, qua illum, cuius is condemnatus est rogatione, P.=\n <code>Haeret in salebra.</code> Non igitur bene. </p><p>Vide igitur ne non=\n debeas verbis nostris uti, sententiis tuis. Vide, quantum, inquam, fallare=\n, Torquate. Heri, inquam, ludis commissis ex urbe profectus veni ad vesperu=\nm. <code>Restinguet citius, si ardentem acceperit.</code> Cyrenaici quidem =\nnon recusant; </p><ol>=09<li>Dici enim nihil potest verius.</li>=09<li>Vide=\namus animi partes, quarum est conspectus illustrior;</li>=09<li>Uterque eni=\nm summo bono fruitur, id est voluptate.</li>=09<li>Sin tantum modo ad indic=\nia veteris memoriae cognoscenda, curiosorum.</li></ol><blockquote cite=3D\'h=\nttp://loripsum.net\'>=09Si stante, hoc natura videlicet vult, salvam esse se=\n, quod concedimus;</blockquote><p>Sed quid attinet de rebus tam apertis plu=\nra requirere? Tum Torquatus: Prorsus, inquit, assentior; Compensabatur, inq=\nuit, cum summis doloribus laetitia. Non ego tecum iam ita iocabor, ut isdem=\n his de rebus, cum L. Tu enim ista lenius, hic Stoicorum more nos vexat. Cu=\nr fortior sit, si illud, quod tute concedis, asperum et vix ferendum putabi=\nt? </p><ul>=09<li>Quam ob rem tandem, inquit, non satisfacit?</li>=09<li>Sa=\npiens autem semper beatus est et est aliquando in dolore;</li>=09<li>Quod s=\ni ita se habeat, non possit beatam praestare vitam sapientia.</li>=09<li>Es=\nt autem a te semper dictum nec gaudere quemquam nisi propter corpus nec dol=\nere.</li></ul><pre>Nam Pyrrho, Aristo, Erillus iam diu abiecti.Cum ageremus=\n, inquit, vitae beatum et eundem supremum diem,scribebamus haec.</pre><dl>=\n=09<dt><dfn>Stoicos roga.</dfn></dt>=09<dd>Beatus autem esse in maximarum r=\nerum timore nemo potest.</dd>=09<dt><dfn>Quonam modo?</dfn></dt>=09<dd>Scio=\n enim esse quosdam, qui quavis lingua philosophari possint;</dd></dl>\n------=_Part_0_1199604121.1431746820297--\n' ] }
};

describe('WebServer', function () {
  beforeEach(function () {
    this.storage = new Storage();
    this.webserver = new WebServer(0, this.storage);
  });
  Object.keys(responses).forEach(function (url) {
    describe('GET ' + url, function () {
      it('returns json api', function (done) {
        request(this.webserver.getApp())
          .get(url)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(responses[url])
          .end(function (err, res) {
            if (err) { return done.fail(err); }
            done();
          });
      });
    });
  });

  describe('DELETE /api/json/messages/b5c89620-665f-42b5-a431-42327d3bff6a', function () {
    var id = 'b5c89620-665f-42b5-a431-42327d3bff6a';
    it('returns json api', function (done) {
      request(this.webserver.getApp())
        .delete('/api/json/messages/' + id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) { return done.fail(err); }
          var arr = this.storage.messages.filter(function (message) { return message.id === id; });
          expect(arr).toEqual([]);
          done();
        }.bind(this));
    });
  });

  describe('DELETE /api/json/messages/', function () {
    it('returns json api', function (done) {
      request(this.webserver.getApp())
        .delete('/api/json/messages/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) { return done.fail(err); }
          expect(this.storage.messages).toEqual([]);
          done();
        }.bind(this));
    });
  });

  describe('GET /api/json/messages/badbadbad', function () {
    it('doesnt returns json api', function (done) {
      request(this.webserver.getApp())
        .get('/api/json/messages/badbadbad')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('not found')
        .end(function (err, res) {
          if (err) { return done.fail(err); }
          done();
        });
    });
  });
});
