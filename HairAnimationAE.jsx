{
    app.beginUndoGroup("Advanced Hair Puppet Wiggle");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Выберите композицию!");
        app.endUndoGroup();
        return;
    } 
    if (comp.selectedLayers.length == 0) {
        alert("Выберите хотя бы один слой волос!");
        app.endUndoGroup();
        return;
    }

    var layer = comp.selectedLayers[0];

    // окно панели
    var win = new Window("palette", "Advanced Hair Puppet Wiggle", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    // параметры
    function addParam(group, label, defaultValue) {
        group.add("statictext", undefined, label);
        return group.add("edittext", undefined, defaultValue);
    }

    var freqGrp = win.add("group");
    var freqInput = addParam(freqGrp, "Частота:", "2");

    var ampGrp = win.add("group");
    var ampInput = addParam(ampGrp, "Амплитуда:", "15");

    var decayGrp = win.add("group");
    var decayInput = addParam(decayGrp, "Затухание:", "2");

    var pinsGrp = win.add("group");
    var pinsInput = addParam(pinsGrp, "Количество пинов:", "5");

    // кнопка для создания анимации
    var createBtn = win.add("button", undefined, "Создать анимацию");

    createBtn.onClick = function() {
        var freq = parseFloat(freqInput.text);
        var amp = parseFloat(ampInput.text);
        var decay = parseFloat(decayInput.text);
        var pinsCount = parseInt(pinsInput.text);

        
        var puppetEffect = layer.property("Effects").property("Puppet");
        if (puppetEffect) puppetEffect.remove();

        // добавляем Puppet 
        var puppet = layer.Effects.addProperty("Puppet");
        var pins = [];

        var width = layer.width;
        var height = layer.height;

        for (var i = 0; i < pinsCount; i++) {
            var pin = puppet.property("Puppet Pins").addProperty("Puppet Pin");

            // Размещение пинов по curves
            var x = width * (i + 1) / (pinsCount + 1);
            var y = height * 0.1 + Math.sin(i / pinsCount * Math.PI) * 5; 
            pin.position.setValue([x, y]);
            pins.push(pin);

            
            var pinAmp = amp * (0.8 + Math.random() * 0.4); 
            var pinFreq = freq * (0.8 + Math.random() * 0.4);

            var expr = "freq = " + pinFreq + ";\n" +
                       "amp = " + pinAmp + ";\n" +
                       "decay = " + decay + ";\n" +
                       "wiggle(freq, amp) * Math.exp(-decay*time);";

            pin.property("Position").expression = expr;
        }

        alert("Анимация волос создана!");
    };

    win.center();
    win.show();

    app.endUndoGroup();
}