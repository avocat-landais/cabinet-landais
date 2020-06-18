$(document).ready(function() {
	moment.locale('fr');
	var _this = {};

	window.setTimeout(function() { // tmp
		$(document).trigger('show-calendar'); //tmp
	}, 20); // tmp

	// show-calendar
	$(document).on('show-calendar', function () {
		// day or week according to the screen size
		var viewType, $width = $(window).width();
		if ($width < 768) {
			viewType = 'agendaDay';
		} else {
			viewType = 'agendaWeek';
		}

		_this.$calendar = $('#calendar');
		var options = {
			businessHours: {
				start: '10:00',
				end: '19:30',
				dow: [1, 2, 3, 4, 5, 6]
			},
			titleFormat: 'D MMMM YYYY',
			columnFormat: 'dddd D',
			hiddenDays: [0],
			minTime: '09:30:00',
			allDaySlot: false,
			slotLabelInterval: 1,
			slotLabelFormat: 'HH:mm',
			maxTime: '20:00:00',
			contentHeight: 400,
			defaultView: viewType,
			lang: 'fr',
			editable: false,
			eventClick: clickHandler,
			selectable: false,
			timezone: 'local',
			viewRender: viewRenderHandler
		};

		_this.$calendar.fullCalendar(options);
	});

	/**************
	**  HANDLERS **
	**************/

	var clickHandler = function (calEvent, jsEvent, view) {
		if (calEvent.title === 'créneau réservé') {
			return;
		}
		var $overlay = $('#overlay');
		var $form = $('#overlay form');
		var date = calEvent.start.format("dddd DD MMMM à hh:mm");

		$('#slotDate').text(date);
		$('#email').val('');
		$('#fullname').val('');
		$('#telephone').val('');
		$('#reason').val('');

		var y = ($(window).height() - $form.height()) / 2 + 'px'
		console.log(view);
		if (y <= 0 || view.name === 'agendaDay')
			y = 0;
		$form.css({top: y});

		$overlay
			.css({display: 'block'})
			.animate({opacity: 1});

		$overlay.click(function (e) {
			if (e.clientY < $form.position().top
				|| e.clientY > $form.position().top + $form.outerHeight()
				|| e.clientX < $form.offset().left
				|| e.clientX > $form.offset().left + $form.outerWidth()) {
				$overlay
					.animate({opacity: 0}, function () {
						$overlay.css({display: 'none'});
					});
			}
		});

		$('#overlay-close-icon').click(function () {
			$overlay
				.animate({opacity: 0}, function () {
					$overlay.css({display: 'none'});
				});
		});

		_this.calEvent = calEvent;
		_this.jsEvent = jsEvent;
	};

	var viewRenderHandler = function (view) {
		_this.$calendar.fullCalendar('removeEvents', function(e) {
			return true;
		});
		var start = view.intervalStart.unix();
		var end = view.intervalEnd.unix();
		var events = [];
		$.get('http://192.162.71.99:3000/slots')
    .done(slots => {
			slots.forEach(slot => {
				let start = moment(slot.start).unix();
				let end = moment(slot.end).unix();
				while (start < end) {
					events.push({
						title: 'réserver',
						start: moment(start * 1000),
						end: moment((start + 1800) * 1000),
						color: slot.color === 'green' ? '#a3a9a3' : '#9c8f78',
						className: 'slot-free',
						slotId: shortid(),
					});
					start += 1800;
				}
			});
			_this.$calendar.fullCalendar('addEventSource', events);
    });
	}
	// valid the slot
	$('#confirm').click(function (e) {
		var data = {
			email: $('#email').val(),
			fullname: $('#fullname').val(),
			telephone: $('#telephone').val(),
			reason: $('#reason').val(),
			date: $('#slotDate').text()
		};
		$.ajax({
			type: 'POST',
			url: 'https://avocat-landais-mailer.herokuapp.com/book',
			data: JSON.stringify(data),
			success: function (ok) {
				var $overlay = $('#overlay');
				$overlay
					.animate({opacity: 0}, function () {
						$overlay.css({display: 'none'});
					});
				_this.calEvent.color = 'rgb(172, 72, 68)';
				_this.calEvent.title = 'créneau réservé';
				_this.calEvent.textColor = 'rgb(236,236,236)';
				$(_this.jsEvent.target).removeClass('slot-free');
				$(_this.jsEvent.target).addClass('slot-taken');
				_this.jsEvent.target.disabled = true;
				_this.$calendar.fullCalendar('rerenderEvents');
			},
			error: function (e) { console.error(e) },
			contentType: 'application/json'
		});
		e.preventDefault();
		return false;
	});
});
